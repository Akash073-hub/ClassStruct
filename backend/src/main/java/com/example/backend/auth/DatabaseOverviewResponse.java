package com.example.backend.auth;

import java.util.List;

public record DatabaseOverviewResponse(
        String database,
        String jdbcUrl,
        String table,
        long totalUsers,
        long studentCount,
        long teacherCount,
        List<DatabaseUserRow> sampleRows
) {
}
