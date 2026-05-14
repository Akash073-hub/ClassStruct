package com.example.backend.auth;

public record TeacherClassResponse(
        String code,
        String title,
        String schedule,
        String room
) {
}
