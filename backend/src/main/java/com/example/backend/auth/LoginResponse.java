package com.example.backend.auth;

public record LoginResponse(
        String token,
        String role,
        String name,
        String username,
        String email
) {
}
