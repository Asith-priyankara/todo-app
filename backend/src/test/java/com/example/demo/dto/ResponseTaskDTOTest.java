package com.example.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class ResponseTaskDTOTest {

    private ResponseTaskDTO responseTaskDTO;

    @BeforeEach
    void setUp() {
        responseTaskDTO = new ResponseTaskDTO();
    }

    @Test
    void testResponseTaskDTOCreation() {
        LocalDateTime now = LocalDateTime.now();
        
        responseTaskDTO.setId(1L);
        responseTaskDTO.setTitle("Test Task");
        responseTaskDTO.setDescription("This is a test task");
        responseTaskDTO.setCompleted(false);
        responseTaskDTO.setCreatedAt(now);
        responseTaskDTO.setUserId(100L);

        assertEquals(1L, responseTaskDTO.getId());
        assertEquals("Test Task", responseTaskDTO.getTitle());
        assertEquals("This is a test task", responseTaskDTO.getDescription());
        assertFalse(responseTaskDTO.isCompleted());
        assertEquals(now, responseTaskDTO.getCreatedAt());
        assertEquals(100L, responseTaskDTO.getUserId());
    }

    @Test
    void testResponseTaskDTODefaultValues() {
        assertNull(responseTaskDTO.getId());
        assertNull(responseTaskDTO.getTitle());
        assertNull(responseTaskDTO.getDescription());
        assertFalse(responseTaskDTO.isCompleted());
        assertNull(responseTaskDTO.getCreatedAt());
        assertNull(responseTaskDTO.getUserId());
    }

    @Test
    void testResponseTaskDTOCompletedTask() {
        responseTaskDTO.setCompleted(true);
        assertTrue(responseTaskDTO.isCompleted());

        responseTaskDTO.setCompleted(false);
        assertFalse(responseTaskDTO.isCompleted());
    }

    @Test
    void testResponseTaskDTOSetters() {
        LocalDateTime testDate = LocalDateTime.of(2024, 1, 1, 12, 0);
        
        responseTaskDTO.setId(999L);
        responseTaskDTO.setTitle("Updated Task");
        responseTaskDTO.setDescription("Updated description");
        responseTaskDTO.setCompleted(true);
        responseTaskDTO.setCreatedAt(testDate);
        responseTaskDTO.setUserId(555L);

        assertEquals(999L, responseTaskDTO.getId());
        assertEquals("Updated Task", responseTaskDTO.getTitle());
        assertEquals("Updated description", responseTaskDTO.getDescription());
        assertTrue(responseTaskDTO.isCompleted());
        assertEquals(testDate, responseTaskDTO.getCreatedAt());
        assertEquals(555L, responseTaskDTO.getUserId());
    }

    @Test
    void testResponseTaskDTOWithNullValues() {
        responseTaskDTO.setId(null);
        responseTaskDTO.setTitle(null);
        responseTaskDTO.setDescription(null);
        responseTaskDTO.setCreatedAt(null);
        responseTaskDTO.setUserId(null);

        assertNull(responseTaskDTO.getId());
        assertNull(responseTaskDTO.getTitle());
        assertNull(responseTaskDTO.getDescription());
        assertNull(responseTaskDTO.getCreatedAt());
        assertNull(responseTaskDTO.getUserId());
    }

    @Test
    void testResponseTaskDTODateHandling() {
        LocalDateTime pastDate = LocalDateTime.of(2023, 6, 15, 10, 30);
        LocalDateTime futureDate = LocalDateTime.of(2025, 12, 31, 23, 59);

        responseTaskDTO.setCreatedAt(pastDate);
        assertEquals(pastDate, responseTaskDTO.getCreatedAt());

        responseTaskDTO.setCreatedAt(futureDate);
        assertEquals(futureDate, responseTaskDTO.getCreatedAt());
    }
}
