package com.example.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class TaskTest {

    private Task task;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setPassword("password");

        task = new Task();
    }

    @Test
    void testTaskCreation() {
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("This is a test task");
        task.setCompleted(false);
        task.setCreatedAt(LocalDateTime.now());
        task.setUser(user);

        assertEquals(1L, task.getId());
        assertEquals("Test Task", task.getTitle());
        assertEquals("This is a test task", task.getDescription());
        assertFalse(task.isCompleted());
        assertNotNull(task.getCreatedAt());
        assertEquals(user, task.getUser());
    }

    @Test
    void testTaskDefaultValues() {
        assertFalse(task.isCompleted());
        assertNull(task.getId());
        assertNull(task.getTitle());
        assertNull(task.getDescription());
        assertNull(task.getCreatedAt());
        assertNull(task.getUser());
    }

    @Test
    void testTaskCompletion() {
        task.setCompleted(false);
        assertFalse(task.isCompleted());

        task.setCompleted(true);
        assertTrue(task.isCompleted());
    }

    @Test
    void testTaskUserAssociation() {
        task.setUser(user);
        assertEquals(user, task.getUser());
        assertEquals("test@example.com", task.getUser().getEmail());
    }

    @Test
    void testTaskSetters() {
        LocalDateTime now = LocalDateTime.now();
        
        task.setId(100L);
        task.setTitle("Updated Task");
        task.setDescription("Updated description");
        task.setCompleted(true);
        task.setCreatedAt(now);
        task.setUser(user);

        assertEquals(100L, task.getId());
        assertEquals("Updated Task", task.getTitle());
        assertEquals("Updated description", task.getDescription());
        assertTrue(task.isCompleted());
        assertEquals(now, task.getCreatedAt());
        assertEquals(user, task.getUser());
    }

    @Test
    void testTaskWithNullValues() {
        task.setTitle(null);
        task.setDescription(null);
        task.setCreatedAt(null);
        task.setUser(null);

        assertNull(task.getTitle());
        assertNull(task.getDescription());
        assertNull(task.getCreatedAt());
        assertNull(task.getUser());
        assertFalse(task.isCompleted());
    }

    @Test
    void testTaskCompletedDefaultValue() {
        Task newTask = new Task();
        assertFalse(newTask.isCompleted());
    }

    @Test
    void testTaskWithEmptyStrings() {
        task.setTitle("");
        task.setDescription("");

        assertEquals("", task.getTitle());
        assertEquals("", task.getDescription());
    }

    @Test
    void testTaskUserRelationship() {
        User anotherUser = new User();
        anotherUser.setId(2L);
        anotherUser.setEmail("another@example.com");
        anotherUser.setFullName("Another User");

        task.setUser(user);
        assertEquals(user, task.getUser());
        assertEquals("test@example.com", task.getUser().getEmail());

        task.setUser(anotherUser);
        assertEquals(anotherUser, task.getUser());
        assertEquals("another@example.com", task.getUser().getEmail());
    }
}
