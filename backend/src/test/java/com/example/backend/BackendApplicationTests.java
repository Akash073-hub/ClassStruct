package com.example.backend;

import com.example.backend.auth.AuthController;
import com.example.backend.auth.LoginRequest;
import com.example.backend.auth.LoginResponse;
import com.example.backend.auth.RegisterRequest;
import com.example.backend.auth.RegisterResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void registersAndLogsInStudent() {
        AuthController controller = new AuthController();

        ResponseEntity<RegisterResponse> registerResponse = controller.register(new RegisterRequest(
                "Test Student",
                "TestStudent",
                "teststudent@rvu.edu.in",
                "9876543222",
                "secret123",
                "secret123",
                "student"
        ));

        assertEquals(201, registerResponse.getStatusCode().value());
        assertEquals("TestStudent", registerResponse.getBody().username());

        ResponseEntity<LoginResponse> loginResponse = controller.login(new LoginRequest(
                "TestStudent",
                "teststudent@rvu.edu.in",
                "secret123",
                "student"
        ));

        assertEquals(200, loginResponse.getStatusCode().value());
        assertEquals("Test Student", loginResponse.getBody().name());
    }

    @Test
    void rejectsDuplicateRegistration() {
        AuthController controller = new AuthController();

        assertThrows(ResponseStatusException.class, () -> controller.register(new RegisterRequest(
                "Student One",
                "student1",
                "student1@rvu.edu.in",
                "9876543210",
                "student123",
                "student123",
                "student"
        )));
    }
}
