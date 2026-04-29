package com.example.backend.auth;

public record LoginRequest(
        String username,
        String email,
        String password,
        String role
) {
}
