package com.example.backend.auth;

public record PasswordResetResponse(
        String message,
        String email
) {
}
