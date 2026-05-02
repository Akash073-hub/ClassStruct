package com.example.backend.auth;

public record SocialLoginRequest(
        String provider,
        String email,
        String name,
        String role,
        String token
) {
}
