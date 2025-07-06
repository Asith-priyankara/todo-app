package com.example.demo.controller;

import com.example.demo.dto.CreateTaskDTO;
import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskRepository taskRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private Task testTask;
    private CreateTaskDTO createTaskDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPassword("password");

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setCompleted(false);
        testTask.setCreatedAt(LocalDateTime.now());
        testTask.setUser(testUser);

        createTaskDTO = new CreateTaskDTO();
        createTaskDTO.setTitle("New Task");
        createTaskDTO.setDescription("New Description");
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void testCreateTask_Success() throws Exception {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        mockMvc.perform(post("/api/tasks")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createTaskDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.completed").value(false));

        verify(userRepository).findByEmail("test@example.com");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void testGetTasks_Success() throws Exception {
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setDescription("Description 2");
        task2.setCompleted(false);
        task2.setCreatedAt(LocalDateTime.now());
        task2.setUser(testUser);

        List<Task> tasks = Arrays.asList(testTask, task2);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser)).thenReturn(tasks);

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Task"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].title").value("Task 2"));

        verify(userRepository).findByEmail("test@example.com");
        verify(taskRepository).findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser);
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void testGetTasks_EmptyList() throws Exception {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser)).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(userRepository).findByEmail("test@example.com");
        verify(taskRepository).findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser);
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void testCompleteTask_Success() throws Exception {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        mockMvc.perform(put("/api/tasks/1/complete")
                .with(csrf()))
                .andExpect(status().isOk());

        verify(userRepository).findByEmail("test@example.com");
        verify(taskRepository).findById(1L);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void testCreateTask_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/tasks")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createTaskDTO)))
                .andExpect(status().isUnauthorized());

        verify(userRepository, never()).findByEmail(anyString());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void testGetTasks_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isUnauthorized());

        verify(userRepository, never()).findByEmail(anyString());
        verify(taskRepository, never()).findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(any(User.class));
    }
}
