package com.example.backend.auth;

public record DemoUser(
        String username,
        String email,
        String password,
        String role,
        String displayName
) {
}
