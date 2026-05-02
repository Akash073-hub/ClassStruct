package com.example.backend.auth;

public record RegisterResponse(
        String role,
        String name,
        String username,
        String email
) {
}
