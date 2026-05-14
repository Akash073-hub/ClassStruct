package com.example.backend.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClassStudentSeeder implements CommandLineRunner {

    private final UserAccountRepository userAccountRepository;

    public ClassStudentSeeder(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public void run(String... args) {
        seedTeachers();
        seedStudents();
    }

    private void seedTeachers() {
        for (TeacherSeed teacher : teachers()) {
            TeacherIdentity identity = identityForTeacher(teacher.displayName());

            UserAccount existingTeacher = findByEmail(identity.email());
            if (existingTeacher == null) {
                existingTeacher = findByUsername(identity.username());
            }

            if (existingTeacher != null) {
                existingTeacher.setDisplayName(teacher.displayName());
                existingTeacher.setEmail(identity.email());
                existingTeacher.setUsername(identity.username());
                existingTeacher.setPassword("teacher123");
                existingTeacher.setRole("teacher");
                existingTeacher.setPhone(teacher.phone());
                userAccountRepository.save(existingTeacher);
                continue;
            }

            userAccountRepository.save(new UserAccount(
                    teacher.displayName(),
                    identity.email(),
                    identity.username(),
                    "teacher123",
                    "teacher",
                    null,
                    teacher.phone()
            ));
        }
    }

    private void seedStudents() {
        for (StudentSeed student : students()) {
            String email = emailFrom(student.name());
            UserAccount existingStudent = findByUsn(student.usn());
            if (existingStudent != null) {
                existingStudent.setDisplayName(student.name());
                existingStudent.setEmail(email);
                userAccountRepository.save(existingStudent);
                continue;
            }

            if (emailExists(email)) {
                continue;
            }

            userAccountRepository.save(new UserAccount(
                    student.name(),
                    email,
                    usernameFrom(student.name()),
                    student.usn().toLowerCase(),
                    "student",
                    student.usn(),
                    null
            ));
        }
    }

    private String emailFrom(String name) {
        return name.replaceAll("[^A-Za-z]", "").toLowerCase() + "bca24@rvu.edu.in";
    }

    private String usernameFrom(String name) {
        String base = name.replaceAll("[^A-Za-z]", "");
        if (base.isBlank()) {
            base = "Student";
        }

        String candidate = base;
        int suffix = 0;
        while (usernameExists(candidate)) {
            candidate = base + lettersFor(suffix);
            suffix++;
        }

        return candidate;
    }

    private boolean emailExists(String email) {
        return findByEmail(email) != null;
    }

    private UserAccount findByEmail(String email) {
        return userAccountRepository.findAll().stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
    }

    private UserAccount findByUsername(String username) {
        return userAccountRepository.findAll().stream()
                .filter(user -> user.getUsername().equalsIgnoreCase(username))
                .findFirst()
                .orElse(null);
    }

    private UserAccount findByUsn(String usn) {
        return userAccountRepository.findAll().stream()
                .filter(user -> user.getUsn() != null && user.getUsn().equalsIgnoreCase(usn))
                .findFirst()
                .orElse(null);
    }

    private boolean usernameExists(String username) {
        return userAccountRepository.findAll().stream()
                .anyMatch(user -> user.getUsername().equalsIgnoreCase(username));
    }

    private String lettersFor(int index) {
        StringBuilder value = new StringBuilder();
        int current = index;
        do {
            value.append((char) ('A' + (current % 26)));
            current = current / 26 - 1;
        } while (current >= 0);
        return value.toString();
    }

    private TeacherIdentity identityForTeacher(String displayName) {
        String compact = displayName
                .replaceFirst("(?i)^(prof\\.?|dr\\.?)\\s*", "")
                .replaceAll("[^A-Za-z]", "");

        if (compact.isBlank()) {
            compact = "Teacher";
        }

        String username = Character.toUpperCase(compact.charAt(0)) + compact.substring(1);
        String email = compact.toLowerCase() + "@rvu.edu.in";
        return new TeacherIdentity(username, email);
    }

    private List<TeacherSeed> teachers() {
        return List.of(
                new TeacherSeed("Teacher One", "9876543211"),
                new TeacherSeed("Prof. Sasikala J", "9876543212"),
                new TeacherSeed("Prof. K Sarath", "9876543213"),
                new TeacherSeed("Prof. Mohammed Danish", "9876543214"),
                new TeacherSeed("Dr. Manish Kumar", "9876543215"),
                new TeacherSeed("Prof. Sharath BR", "9876543216")
        );
    }

    private List<StudentSeed> students() {
        return List.of(
                new StudentSeed("1RUA24BCA0001", "ABHAY M BIJU"),
                new StudentSeed("1RUA24BCA0003", "ABINAND RAJIV THICHUVALAPPIL"),
                new StudentSeed("1RUA24BCA0004", "AKANKSHA"),
                new StudentSeed("1RUA24BCA0005", "AKASH RAMACHANDRA BHAT"),
                new StudentSeed("1RUA24BCA0006", "AKASH SINGHBISHT"),
                new StudentSeed("1RUA24BCA0007", "AKSHATHA B S"),
                new StudentSeed("1RUA24BCA0008", "AMBRISH DHANVEE B"),
                new StudentSeed("1RUA24BCA0010", "AMRITHAA M"),
                new StudentSeed("1RUA24BCA0011", "ANANYA R"),
                new StudentSeed("1RUA24BCA0014", "ARYAN YADAV"),
                new StudentSeed("1RUA24BCA0016", "CHARAN M"),
                new StudentSeed("1RUA24BCA0018", "CHINCHANA K"),
                new StudentSeed("1RUA24BCA0019", "D DAKSH"),
                new StudentSeed("1RUA24BCA0020", "DEEKSHA"),
                new StudentSeed("1RUA24BCA0021", "DEEKSHA MAHESH"),
                new StudentSeed("1RUA24BCA0025", "ESHESHWARI KUMARI"),
                new StudentSeed("1RUA24BCA0027", "GAURAV P RAO"),
                new StudentSeed("1RUA24BCA0028", "GIRISH KAILASH"),
                new StudentSeed("1RUA24BCA0029", "HARSHA GOPALKRISHNA PURANIK"),
                new StudentSeed("1RUA24BCA0030", "HARSHA M"),
                new StudentSeed("1RUA24BCA0031", "HARSHITH K"),
                new StudentSeed("1RUA24BCA0032", "HARSHITHA H"),
                new StudentSeed("1RUA24BCA0033", "HEMASAI C"),
                new StudentSeed("1RUA24BCA0034", "INDRANIL SAHA"),
                new StudentSeed("1RUA24BCA0036", "JAHNAVI P R"),
                new StudentSeed("1RUA24BCA0037", "JANHAVI B"),
                new StudentSeed("1RUA24BCA0039", "JEEVAN R"),
                new StudentSeed("1RUA24BCA0041", "JUSTIN"),
                new StudentSeed("1RUA24BCA0044", "KOUSHAL MANDAL"),
                new StudentSeed("1RUA24BCA0046", "LAXMAN BHATT"),
                new StudentSeed("1RUA24BCA0050", "MEGASHREE J"),
                new StudentSeed("1RUA24BCA0051", "MOHAMMED SUHAIL"),
                new StudentSeed("1RUA24BCA0053", "MOHAN R"),
                new StudentSeed("1RUA24BCA0055", "N DEEPTHI NAGARAJ"),
                new StudentSeed("1RUA24BCA0056", "NAMISH M S"),
                new StudentSeed("1RUA24BCA0057", "NANDAN J"),
                new StudentSeed("1RUA24BCA0059", "NAYANA R"),
                new StudentSeed("1RUA24BCA0060", "NEEL CHOWDHARY GONUGUNTLA"),
                new StudentSeed("1RUA24BCA0061", "NEHA KIRAN"),
                new StudentSeed("1RUA24BCA0063", "NITHIN RAVI"),
                new StudentSeed("1RUA24BCA0065", "POORVI R"),
                new StudentSeed("1RUA24BCA0066", "PRAHLAD BHAT"),
                new StudentSeed("1RUA24BCA0069", "PRATEEKSHA S"),
                new StudentSeed("1RUA24BCA0071", "PREETHI V"),
                new StudentSeed("1RUA24BCA0072", "PRUTHVI GOWDA R"),
                new StudentSeed("1RUA24BCA0075", "RIYAN SHRESTHA"),
                new StudentSeed("1RUA24BCA0076", "S BALAMURUGAN ADARSH"),
                new StudentSeed("1RUA24BCA0080", "SHARADHI RAI"),
                new StudentSeed("1RUA24BCA0081", "SHARON ARLIN"),
                new StudentSeed("1RUA24BCA0082", "SHISHIR"),
                new StudentSeed("1RUA24BCA0083", "SHIVARAJ"),
                new StudentSeed("1RUA24BCA0084", "SHYAM SUNDAR A"),
                new StudentSeed("1RUA24BCA0085", "SUMEDHA T S"),
                new StudentSeed("1RUA24BCA0086", "SUMUKH R"),
                new StudentSeed("1RUA24BCA0088", "SUZAINA KHANUM"),
                new StudentSeed("1RUA24BCA0089", "SWAROOP R"),
                new StudentSeed("1RUA24BCA0090", "SWAYAM DEEKSHA R B"),
                new StudentSeed("1RUA24BCA0091", "SYED YASIR"),
                new StudentSeed("1RUA24BCA0095", "VARSHA C"),
                new StudentSeed("1RUA24BCA0096", "VARUN SARAVANAN MUDALIAR"),
                new StudentSeed("1RUA24BCA0100", "VISHWAS GOWDA MN"),
                new StudentSeed("1RUA24BCA0101", "YASHWANTH PV")
        );
    }

    private record StudentSeed(String usn, String name) {
    }

    private record TeacherSeed(String displayName, String phone) {
    }

    private record TeacherIdentity(String username, String email) {
    }
}
