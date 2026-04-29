package com.example.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final List<DemoUser> USERS = List.of(
            new DemoUser("student1", "student1@rvu.edu.in", "student123", "student", "Student One"),
            new DemoUser("teacher1", "teacher1@rvu.edu.in", "teacher123", "teacher", "Teacher One")
    );

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request == null || request.username() == null || request.email() == null || request.password() == null || request.role() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields");
        }

        Optional<DemoUser> matchedUser = USERS.stream()
                .filter(user -> user.username().equalsIgnoreCase(request.username().trim()))
                .filter(user -> user.email().equalsIgnoreCase(request.email().trim()))
                .filter(user -> user.password().equals(request.password()))
                .filter(user -> user.role().equalsIgnoreCase(request.role().trim()))
                .findFirst();

        if (matchedUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        DemoUser user = matchedUser.get();
        return ResponseEntity.ok(new LoginResponse(
                "demo-token-" + user.role() + "-" + user.username(),
                user.role(),
                user.displayName(),
                user.username(),
                user.email()
        ));
    }
}
