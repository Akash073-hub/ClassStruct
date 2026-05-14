package com.example.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private static final Pattern ALPHA_ONLY = Pattern.compile("^[A-Za-z]+$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[A-Za-z][A-Za-z\\s]*$");
    private static final Pattern RVU_EMAIL = Pattern.compile("^[^\\s@]+@rvu\\.edu\\.in$", Pattern.CASE_INSENSITIVE);
    private static final Pattern INDIAN_PHONE = Pattern.compile("^[6-9]\\d{9}$");

    private final UserAccountRepository userAccountRepository;

    public ProfileController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping
    public ProfileResponse profile(@RequestParam String email, @RequestParam String role) {
        String normalizedRole = normalizeRole(role);
        UserAccount user = findByEmailAndRole(email, normalizedRole)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return toResponse(user);
    }

    @PutMapping
    public ProfileResponse updateProfile(@RequestBody ProfileUpdateRequest request) {
        if (request == null || isBlank(request.currentEmail()) || isBlank(request.role())
                || isBlank(request.name()) || isBlank(request.username()) || isBlank(request.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Required profile fields are missing");
        }

        String normalizedRole = normalizeRole(request.role());
        String currentEmail = request.currentEmail().trim().toLowerCase();
        String displayName = request.name().trim();
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();
        String phone = isBlank(request.phone()) ? null : request.phone().trim();

        if (displayName.length() < 2 || !NAME_PATTERN.matcher(displayName).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use a valid full name");
        }

        if (!ALPHA_ONLY.matcher(username).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must contain only letters");
        }

        if (!RVU_EMAIL.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use a valid @rvu.edu.in email");
        }

        if (phone != null && !INDIAN_PHONE.matcher(phone).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid 10-digit Indian mobile number");
        }

        UserAccount user = findByEmailAndRole(currentEmail, normalizedRole)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean usernameTaken = userAccountRepository.findAll().stream()
                .anyMatch(existing -> !existing.getId().equals(user.getId())
                        && existing.getUsername().equalsIgnoreCase(username));
        if (usernameTaken) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        boolean emailTaken = userAccountRepository.findAll().stream()
                .anyMatch(existing -> !existing.getId().equals(user.getId())
                        && existing.getEmail().equalsIgnoreCase(email));
        if (emailTaken) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        if (phone != null) {
            boolean phoneTaken = userAccountRepository.findAll().stream()
                    .anyMatch(existing -> !existing.getId().equals(user.getId())
                            && existing.getPhone() != null
                            && existing.getPhone().equals(phone));
            if (phoneTaken) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Phone number already exists");
            }
        }

        user.setDisplayName(displayName);
        user.setUsername(username);
        user.setEmail(email);
        user.setPhone(phone);
        userAccountRepository.save(user);

        return toResponse(user);
    }

    private static String normalizeRole(String role) {
        if (isBlank(role)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }
        String normalized = role.trim().toLowerCase();
        if (!normalized.equals("student") && !normalized.equals("teacher")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be student or teacher");
        }
        return normalized;
    }

    private Optional<UserAccount> findByEmailAndRole(String email, String role) {
        return userAccountRepository.findAll().stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email.trim()))
                .filter(user -> user.getRole().equalsIgnoreCase(role.trim()))
                .findFirst();
    }

    private static ProfileResponse toResponse(UserAccount user) {
        return new ProfileResponse(
                user.getRole(),
                user.getDisplayName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getUsn()
        );
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
