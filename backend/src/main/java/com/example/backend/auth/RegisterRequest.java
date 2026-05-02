package com.example.backend.auth;

public record RegisterRequest(
        String fullName,
        String username,
        String email,
        String phone,
        String password,
        String confirmPassword,
        String role
) {
}
