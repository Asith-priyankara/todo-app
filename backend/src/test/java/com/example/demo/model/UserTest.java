package com.example.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
    }

    @Test
    void testUserCreation() {
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setPassword("password123");

        assertEquals(1L, user.getId());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("Test User", user.getFullName());
        assertEquals("password123", user.getPassword());
    }

    @Test
    void testUserDefaultValues() {
        assertNull(user.getId());
        assertNull(user.getEmail());
        assertNull(user.getFullName());
        assertNull(user.getPassword());
        assertNull(user.getTasks());
    }

    @Test
    void testUserTasksAssociation() {
        List<Task> tasks = new ArrayList<>();
        
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setUser(user);
        tasks.add(task1);

        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setUser(user);
        tasks.add(task2);

        user.setTasks(tasks);

        assertEquals(2, user.getTasks().size());
        assertEquals("Task 1", user.getTasks().get(0).getTitle());
        assertEquals("Task 2", user.getTasks().get(1).getTitle());
        assertEquals(user, user.getTasks().get(0).getUser());
        assertEquals(user, user.getTasks().get(1).getUser());
    }

    @Test
    void testUserSetters() {
        user.setId(100L);
        user.setEmail("updated@example.com");
        user.setFullName("Updated User");
        user.setPassword("newpassword");

        assertEquals(100L, user.getId());
        assertEquals("updated@example.com", user.getEmail());
        assertEquals("Updated User", user.getFullName());
        assertEquals("newpassword", user.getPassword());
    }

    @Test
    void testUserWithEmptyTasksList() {
        user.setTasks(new ArrayList<>());
        assertNotNull(user.getTasks());
        assertTrue(user.getTasks().isEmpty());
    }

    @Test
    void testUserEqualsAndHashCode() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("test@example.com");

        User user2 = new User();
        user2.setId(1L);
        user2.setEmail("test@example.com");

        assertNotEquals(user1, user2);
    }
}
