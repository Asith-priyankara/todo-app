package com.example.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class CreateTaskDTOTest {

    private CreateTaskDTO createTaskDTO;

    @BeforeEach
    void setUp() {
        createTaskDTO = new CreateTaskDTO();
    }

    @Test
    void testCreateTaskDTOCreation() {
        createTaskDTO.setTitle("Test Task");
        createTaskDTO.setDescription("This is a test task description");

        assertEquals("Test Task", createTaskDTO.getTitle());
        assertEquals("This is a test task description", createTaskDTO.getDescription());
    }

    @Test
    void testCreateTaskDTODefaultValues() {
        assertNull(createTaskDTO.getTitle());
        assertNull(createTaskDTO.getDescription());
    }

    @Test
    void testCreateTaskDTOSetters() {
        createTaskDTO.setTitle("Updated Task");
        createTaskDTO.setDescription("Updated description");

        assertEquals("Updated Task", createTaskDTO.getTitle());
        assertEquals("Updated description", createTaskDTO.getDescription());
    }

    @Test
    void testCreateTaskDTOWithEmptyValues() {
        createTaskDTO.setTitle("");
        createTaskDTO.setDescription("");

        assertEquals("", createTaskDTO.getTitle());
        assertEquals("", createTaskDTO.getDescription());
    }

    @Test
    void testCreateTaskDTOWithNullValues() {
        createTaskDTO.setTitle(null);
        createTaskDTO.setDescription(null);

        assertNull(createTaskDTO.getTitle());
        assertNull(createTaskDTO.getDescription());
    }

    @Test
    void testCreateTaskDTOWithLongValues() {
        String longTitle = "This is a very long task title that might exceed normal length expectations";
        String longDescription = "This is a very long task description that contains multiple sentences and provides detailed information about what the task involves and what needs to be accomplished.";

        createTaskDTO.setTitle(longTitle);
        createTaskDTO.setDescription(longDescription);

        assertEquals(longTitle, createTaskDTO.getTitle());
        assertEquals(longDescription, createTaskDTO.getDescription());
    }
}
