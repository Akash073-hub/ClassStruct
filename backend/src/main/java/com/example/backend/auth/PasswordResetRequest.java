package com.example.backend.auth;

public record PasswordResetRequest(
        String email,
        String role
) {
}
