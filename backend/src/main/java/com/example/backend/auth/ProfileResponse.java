package com.example.backend.auth;

public record ProfileResponse(
        String role,
        String name,
        String username,
        String email,
        String phone,
        String usn
) {
}
