package com.example.backend.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/database")
@CrossOrigin(origins = "*")
public class DatabaseController {

    private final UserAccountRepository userAccountRepository;
    private final String jdbcUrl;

    public DatabaseController(
            UserAccountRepository userAccountRepository,
            @Value("${spring.datasource.url}") String jdbcUrl
    ) {
        this.userAccountRepository = userAccountRepository;
        this.jdbcUrl = jdbcUrl;
    }

    @GetMapping("/overview")
    public DatabaseOverviewResponse overview(@RequestParam(defaultValue = "20") int limit) {
        List<UserAccount> users = userAccountRepository.findAll();
        int safeLimit = Math.max(1, Math.min(limit, 100));

        return new DatabaseOverviewResponse(
                "H2 file database",
                jdbcUrl,
                "users",
                users.size(),
                countRole(users, "student"),
                countRole(users, "teacher"),
                users.stream()
                        .sorted(Comparator
                                .comparing(UserAccount::getRole, String.CASE_INSENSITIVE_ORDER)
                                .thenComparing(UserAccount::getUsn, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER))
                                .thenComparing(UserAccount::getDisplayName, String.CASE_INSENSITIVE_ORDER))
                        .limit(safeLimit)
                        .map(this::toRow)
                        .toList()
        );
    }

    @GetMapping("/users")
    public List<DatabaseUserRow> users() {
        return userAccountRepository.findAll().stream()
                .sorted(Comparator
                        .comparing(UserAccount::getRole, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(UserAccount::getUsn, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER))
                        .thenComparing(UserAccount::getDisplayName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toRow)
                .toList();
    }

    private long countRole(List<UserAccount> users, String role) {
        return users.stream()
                .filter(user -> role.equalsIgnoreCase(user.getRole()))
                .count();
    }

    private DatabaseUserRow toRow(UserAccount user) {
        return new DatabaseUserRow(
                user.getId(),
                user.getRole(),
                user.getDisplayName(),
                user.getUsername(),
                user.getEmail(),
                user.getUsn(),
                user.getPhone()
        );
    }
}
