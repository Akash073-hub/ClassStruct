package com.example.backend.auth;

public record ProfileUpdateRequest(
        String currentEmail,
        String role,
        String name,
        String username,
        String email,
        String phone
) {
}
