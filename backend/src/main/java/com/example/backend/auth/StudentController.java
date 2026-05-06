package com.example.backend.auth;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final UserAccountRepository userAccountRepository;

    public StudentController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping
    public List<StudentResponse> allStudents() {
        return userAccountRepository.findAll().stream()
                .filter(user -> "student".equalsIgnoreCase(user.getRole()))
                .sorted(Comparator.comparing(UserAccount::getUsn, Comparator.nullsLast(String::compareToIgnoreCase)))
                .map(user -> new StudentResponse(
                        user.getUsn(),
                        user.getDisplayName(),
                        user.getEmail(),
                        user.getUsername()
                ))
                .toList();
    }
}
