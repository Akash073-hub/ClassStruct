package com.example.backend.auth;

public record StudentResponse(
        String usn,
        String name,
        String email,
        String username
) {
}
