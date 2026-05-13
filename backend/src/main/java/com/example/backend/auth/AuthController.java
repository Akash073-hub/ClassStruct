package com.example.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Pattern ALPHA_ONLY = Pattern.compile("^[A-Za-z]+$");
    private static final Pattern NAME_OR_USERNAME = Pattern.compile("^[A-Za-z][A-Za-z\\s]*$");
    private static final Pattern RVU_EMAIL = Pattern.compile("^[^\\s@]+@rvu\\.edu\\.in$", Pattern.CASE_INSENSITIVE);
    private static final Pattern INDIAN_PHONE = Pattern.compile("^[6-9]\\d{9}$");

    private final UserAccountRepository userAccountRepository;

    public AuthController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        validateRegistration(request);

        String role = normalizeRole(request.role());
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();
        String fullName = request.fullName().trim();
        String phone = request.phone().trim();

        boolean userExists = userAccountRepository.findAll().stream()
                .anyMatch(user -> user.getUsername().equalsIgnoreCase(username)
                        || user.getEmail().equalsIgnoreCase(email)
                        || (user.getPhone() != null && user.getPhone().equals(phone)));

        if (userExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username, email, or phone already exists");
        }

        UserAccount user = new UserAccount(fullName, email, username, request.password(), role, null, phone);
        userAccountRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(user.getRole(), user.getDisplayName(), user.getUsername(), user.getEmail()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponse> forgotPassword(@RequestBody PasswordResetRequest request) {
        if (request == null || isBlank(request.email()) || isBlank(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and role are required");
        }

        String role = normalizeRole(request.role());
        String email = request.email().trim();
        if (!RVU_EMAIL.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use a valid @rvu.edu.in email");
        }

        findByEmailAndRole(email, role)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No user found"));

        return ResponseEntity.ok(new PasswordResetResponse("Password reset request accepted", email));
    }

    @PostMapping("/social-login")
    public ResponseEntity<LoginResponse> socialLogin(@RequestBody SocialLoginRequest request) {
        if (request == null || isBlank(request.provider()) || isBlank(request.email()) || isBlank(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provider, email, and role are required");
        }

        String role = normalizeRole(request.role());
        String email = request.email().trim().toLowerCase();
        if (!RVU_EMAIL.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use your RVU college email");
        }

        UserAccount user = findByEmailAndRole(email, role)
                .orElseGet(() -> {
                    String displayName = isBlank(request.name()) ? email.substring(0, email.indexOf("@")) : request.name().trim();
                    String username = uniqueUsername(displayName);
                    return userAccountRepository.save(new UserAccount(displayName, email, username, "social-login", role, null, null));
                });

        return ResponseEntity.ok(loginResponseFor(user));
    }

    @GetMapping("/lookup")
    public ResponseEntity<LookupResponse> lookup(@RequestParam String email, @RequestParam String role) {
        if (!RVU_EMAIL.matcher(email.trim()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use a valid @rvu.edu.in email");
        }

        String normalizedRole = normalizeRole(role);
        Optional<UserAccount> matchedUser = findByEmailAndRole(email.trim(), normalizedRole);

        if (matchedUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No user found");
        }

        UserAccount user = matchedUser.get();
        return ResponseEntity.ok(new LookupResponse(user.getDisplayName(), user.getUsername(), user.getRole(), user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request == null || isBlank(request.username()) || isBlank(request.email()) || isBlank(request.password()) || isBlank(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields");
        }

        String role = normalizeRole(request.role());
        String username = request.username().trim();
        String email = request.email().trim();

        if (!NAME_OR_USERNAME.matcher(username).matches() || !RVU_EMAIL.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid login details");
        }

        UserAccount user = userAccountRepository.findAll().stream()
                .filter(existing -> existing.getUsername().equalsIgnoreCase(username)
                        || existing.getDisplayName().equalsIgnoreCase(username))
                .filter(existing -> existing.getEmail().equalsIgnoreCase(email))
                .filter(existing -> existing.getRole().equalsIgnoreCase(role))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        return ResponseEntity.ok(loginResponseFor(user));
    }

    private static void validateRegistration(RegisterRequest request) {
        if (request == null || isBlank(request.fullName()) || isBlank(request.username())
                || isBlank(request.email()) || isBlank(request.phone()) || isBlank(request.password())
                || isBlank(request.confirmPassword()) || isBlank(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields are required");
        }

        if (request.fullName().trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name is required");
        }

        if (!ALPHA_ONLY.matcher(request.username().trim()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must contain only letters");
        }

        if (!RVU_EMAIL.matcher(request.email().trim()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use a valid @rvu.edu.in email");
        }

        if (!INDIAN_PHONE.matcher(request.phone().trim()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid 10-digit Indian mobile number");
        }

        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        normalizeRole(request.role());
    }

    private static String normalizeRole(String role) {
        String normalized = role.trim().toLowerCase();
        if (!normalized.equals("student") && !normalized.equals("teacher")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be student or teacher");
        }
        return normalized;
    }

    private static LoginResponse loginResponseFor(UserAccount user) {
        return new LoginResponse(
                "demo-token-" + user.getRole() + "-" + user.getUsername(),
                user.getRole(),
                user.getDisplayName(),
                user.getUsername(),
                user.getEmail()
        );
    }

    private String uniqueUsername(String displayName) {
        String base = displayName.replaceAll("[^A-Za-z]", "");
        if (base.isBlank()) {
            base = "User";
        }

        String candidate = base;
        int suffix = 1;
        while (usernameExists(candidate)) {
            candidate = base + lettersFor(suffix);
            suffix++;
        }
        return candidate;
    }

    private boolean usernameExists(String username) {
        return userAccountRepository.findAll().stream()
                .anyMatch(user -> user.getUsername().equalsIgnoreCase(username));
    }

    private Optional<UserAccount> findByEmailAndRole(String email, String role) {
        return userAccountRepository.findAll().stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email.trim()))
                .filter(user -> user.getRole().equalsIgnoreCase(role.trim()))
                .findFirst();
    }

    private String lettersFor(int index) {
        StringBuilder value = new StringBuilder();
        int current = index;
        do {
            value.append((char) ('A' + (current % 26)));
            current = current / 26 - 1;
        } while (current >= 0);
        return value.toString();
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
