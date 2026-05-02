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

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Pattern ALPHA_ONLY = Pattern.compile("^[A-Za-z]+$");
    private static final Pattern RVU_EMAIL = Pattern.compile("^[^\\s@]+@rvu\\.edu\\.in$", Pattern.CASE_INSENSITIVE);
    private static final Pattern INDIAN_PHONE = Pattern.compile("^[6-9]\\d{9}$");

    private static final List<DemoUser> USERS = new CopyOnWriteArrayList<>(List.of(
            new DemoUser("student1", "student1@rvu.edu.in", "student123", "student", "Student One", "9876543210"),
            new DemoUser("teacher1", "teacher1@rvu.edu.in", "teacher123", "teacher", "Teacher One", "9876543211")
    ));

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        validateRegistration(request);

        String role = normalizeRole(request.role());
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();
        String fullName = request.fullName().trim();
        String phone = request.phone().trim();

        boolean userExists = USERS.stream()
                .anyMatch(user -> user.username().equalsIgnoreCase(username)
                        || user.email().equalsIgnoreCase(email)
                        || (user.phone() != null && user.phone().equals(phone)));

        if (userExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username, email, or phone already exists");
        }

        DemoUser user = new DemoUser(username, email, request.password(), role, fullName, phone);
        USERS.add(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(user.role(), user.displayName(), user.username(), user.email()));
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

        USERS.stream()
                .filter(user -> user.email().equalsIgnoreCase(email))
                .filter(user -> user.role().equalsIgnoreCase(role))
                .findFirst()
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

        DemoUser user = USERS.stream()
                .filter(existing -> existing.email().equalsIgnoreCase(email))
                .filter(existing -> existing.role().equalsIgnoreCase(role))
                .findFirst()
                .orElseGet(() -> {
                    String displayName = isBlank(request.name()) ? email.substring(0, email.indexOf("@")) : request.name().trim();
                    String username = uniqueUsername(displayName);
                    DemoUser createdUser = new DemoUser(username, email, "social-login", role, displayName, null);
                    USERS.add(createdUser);
                    return createdUser;
                });

        return ResponseEntity.ok(loginResponseFor(user));
    }

    @GetMapping("/lookup")
    public ResponseEntity<LookupResponse> lookup(@RequestParam String email, @RequestParam String role) {
        if (!RVU_EMAIL.matcher(email.trim()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use a valid @rvu.edu.in email");
        }

        String normalizedRole = normalizeRole(role);
        Optional<DemoUser> matchedUser = USERS.stream()
                .filter(user -> user.email().equalsIgnoreCase(email.trim()))
                .filter(user -> user.role().equalsIgnoreCase(normalizedRole))
                .findFirst();

        if (matchedUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No user found");
        }

        DemoUser user = matchedUser.get();
        return ResponseEntity.ok(new LookupResponse(user.displayName(), user.username(), user.role(), user.email()));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request == null || isBlank(request.username()) || isBlank(request.email()) || isBlank(request.password()) || isBlank(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields");
        }

        String role = normalizeRole(request.role());
        String username = request.username().trim();
        String email = request.email().trim();

        if (!ALPHA_ONLY.matcher(username).matches() || !RVU_EMAIL.matcher(email).matches() || request.password().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid login details");
        }

        DemoUser user = USERS.stream()
                .filter(existing -> existing.username().equalsIgnoreCase(username)
                        || existing.displayName().equalsIgnoreCase(username))
                .filter(existing -> existing.email().equalsIgnoreCase(email))
                .filter(existing -> existing.password().equals(request.password()))
                .filter(existing -> existing.role().equalsIgnoreCase(role))
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

        if (request.password().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
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

    private static LoginResponse loginResponseFor(DemoUser user) {
        return new LoginResponse(
                "demo-token-" + user.role() + "-" + user.username(),
                user.role(),
                user.displayName(),
                user.username(),
                user.email()
        );
    }

    private static String uniqueUsername(String displayName) {
        String base = displayName.replaceAll("[^A-Za-z]", "");
        if (base.isBlank()) {
            base = "User";
        }

        String candidate = base;
        int suffix = 1;
        while (usernameExists(candidate)) {
            candidate = base + suffix;
            suffix++;
        }
        return candidate;
    }

    private static boolean usernameExists(String username) {
        return USERS.stream().anyMatch(user -> user.username().equalsIgnoreCase(username));
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
