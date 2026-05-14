package com.example.backend.auth;

public record DatabaseUserRow(
        Long id,
        String role,
        String displayName,
        String username,
        String email,
        String usn,
        String phone
) {
}
