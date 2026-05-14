package com.example.backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*")
public class TeacherController {

    private final UserAccountRepository userAccountRepository;

    public TeacherController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping("/dashboard")
    public TeacherDashboardResponse dashboard(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Teacher email is required");
        }

        UserAccount teacher = userAccountRepository.findAll().stream()
                .filter(user -> "teacher".equalsIgnoreCase(user.getRole()))
                .filter(user -> user.getEmail().equalsIgnoreCase(email.trim()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

        List<StudentResponse> students = studentsForTeacher(teacher);

        List<TeacherClassResponse> classes = classesFor(teacher);

        return new TeacherDashboardResponse(
                teacher.getDisplayName(),
                teacher.getEmail(),
                teacher.getUsername(),
                students.size(),
                classes.size(),
                students,
                classes
        );
    }

    private List<StudentResponse> studentsForTeacher(UserAccount teacher) {
        List<UserAccount> allStudents = userAccountRepository.findAll().stream()
                .filter(user -> "student".equalsIgnoreCase(user.getRole()))
                .sorted(Comparator.comparing(UserAccount::getUsn, Comparator.nullsLast(String::compareToIgnoreCase)))
                .toList();

        List<UserAccount> allTeachers = userAccountRepository.findAll().stream()
                .filter(user -> "teacher".equalsIgnoreCase(user.getRole()))
                .sorted(Comparator.comparing(UserAccount::getEmail, String.CASE_INSENSITIVE_ORDER))
                .toList();

        int teacherIndex = -1;
        for (int i = 0; i < allTeachers.size(); i++) {
            if (allTeachers.get(i).getEmail().equalsIgnoreCase(teacher.getEmail())) {
                teacherIndex = i;
                break;
            }
        }

        if (teacherIndex < 0 || allTeachers.size() <= 1) {
            return allStudents.stream()
                    .map(student -> new StudentResponse(
                            student.getUsn(),
                            student.getDisplayName(),
                            student.getEmail(),
                            student.getUsername()
                    ))
                    .toList();
        }

        int finalTeacherIndex = teacherIndex;
        int teacherCount = allTeachers.size();

        return java.util.stream.IntStream.range(0, allStudents.size())
                .filter(index -> index % teacherCount == finalTeacherIndex)
                .mapToObj(index -> allStudents.get(index))
                .map(student -> new StudentResponse(
                        student.getUsn(),
                        student.getDisplayName(),
                        student.getEmail(),
                        student.getUsername()
                ))
                .toList();
    }

    private List<TeacherClassResponse> classesFor(UserAccount teacher) {
        String key = (teacher.getDisplayName() + " " + teacher.getUsername()).toLowerCase();

        if (key.contains("sasikala")) {
            return List.of(
                    new TeacherClassResponse("MATH", "Mathematics", "Mon 11:10-12:10, Wed 10:10-11:10", "C404/C405"),
                    new TeacherClassResponse("PT", "Probability Theory", "Mon 11:10-12:10", "C404")
            );
        }

        if (key.contains("sarath")) {
            return List.of(
                    new TeacherClassResponse("AI", "Fundamentals of AI", "Tue 11:10-12:10, Fri 09:10-10:10", "C404/C405"),
                    new TeacherClassResponse("AILAB", "AI Lab", "Wed 11:10-01:10", "C504")
            );
        }

        if (key.contains("mohammed") || key.contains("danish")) {
            return List.of(
                    new TeacherClassResponse("MAD", "Mobile Application Development", "Thu 09:10-11:10", "C404"),
                    new TeacherClassResponse("MADLAB", "MAD Lab", "Mon 09:10-11:10", "C504")
            );
        }

        if (key.contains("manish")) {
            return List.of(
                    new TeacherClassResponse("AGILE", "Agile Software Engineering", "Wed 09:10-10:10, Fri 10:10-11:10", "C405"),
                    new TeacherClassResponse("AGILELAB", "Agile Lab", "Tue 09:10-11:10", "C404")
            );
        }

        if (key.contains("sharath")) {
            return List.of(
                    new TeacherClassResponse("UHV", "Universal Human Values", "Tue 12:10-01:10, Thu 11:10-12:10", "C404"),
                    new TeacherClassResponse("MENTOR", "Mentor Support", "Fri 11:10-12:10", "C404")
            );
        }

        return List.of(
                new TeacherClassResponse("MENTOR", "Class Mentorship", "Fri 11:10-12:10", "C404")
        );
    }
}
