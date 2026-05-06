package com.example.backend;

import com.example.backend.auth.AuthController;
import com.example.backend.auth.LoginRequest;
import com.example.backend.auth.LoginResponse;
import com.example.backend.auth.RegisterRequest;
import com.example.backend.auth.RegisterResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:classstruct-test;DB_CLOSE_DELAY=-1")
class BackendApplicationTests {

    @Autowired
    private AuthController controller;

    @Test
    void contextLoads() {
    }

    @Test
    void registersAndLogsInStudent() {
        String suffix = UUID.randomUUID().toString().replaceAll("[^A-Fa-f]", "");
        String username = "TestStudent" + suffix.substring(0, Math.min(8, suffix.length()));
        String email = username.toLowerCase() + "@rvu.edu.in";

        ResponseEntity<RegisterResponse> registerResponse = controller.register(new RegisterRequest(
                "Test Student",
                username,
                email,
                "9876543222",
                "secret123",
                "secret123",
                "student"
        ));

        assertEquals(201, registerResponse.getStatusCode().value());
        assertEquals(username, registerResponse.getBody().username());

        ResponseEntity<LoginResponse> loginResponse = controller.login(new LoginRequest(
                username,
                email,
                "secret123",
                "student"
        ));

        assertEquals(200, loginResponse.getStatusCode().value());
        assertEquals("Test Student", loginResponse.getBody().name());
    }

    @Test
    void rejectsDuplicateRegistration() {
        assertThrows(ResponseStatusException.class, () -> controller.register(new RegisterRequest(
                "ABHAY M BIJU",
                "ABHAYMBIJU",
                "abhaymbijubca24@rvu.edu.in",
                "9876543210",
                "student123",
                "student123",
                "student"
        )));
    }
}
