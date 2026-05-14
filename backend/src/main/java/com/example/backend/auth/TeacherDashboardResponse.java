package com.example.backend.auth;

import java.util.List;

public record TeacherDashboardResponse(
        String teacherName,
        String teacherEmail,
        String teacherUsername,
        int totalStudents,
        int totalClasses,
        List<StudentResponse> students,
        List<TeacherClassResponse> classes
) {
}
