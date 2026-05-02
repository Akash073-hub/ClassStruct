package com.example.backend.auth;

public record LookupResponse(
        String name,
        String username,
        String role,
        String email
) {
}
