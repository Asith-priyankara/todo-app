package com.example.demo.repository;

import com.example.demo.model.Task;
import com.example.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class TaskRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TaskRepository taskRepository;

    private User testUser;
    private User anotherUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPassword("password123");
        testUser = entityManager.persistAndFlush(testUser);

        anotherUser = new User();
        anotherUser.setEmail("another@example.com");
        anotherUser.setFullName("Another User");
        anotherUser.setPassword("password456");
        anotherUser = entityManager.persistAndFlush(anotherUser);
    }

    @Test
    void testFindTop5ByUserAndCompletedFalseOrderByCreatedAtDesc() {
        LocalDateTime baseTime = LocalDateTime.now();
        
        for (int i = 0; i < 7; i++) {
            Task task = new Task();
            task.setTitle("Task " + i);
            task.setDescription("Description " + i);
            task.setCompleted(false);
            task.setCreatedAt(baseTime.plusMinutes(i));
            task.setUser(testUser);
            entityManager.persistAndFlush(task);
        }

        Task completedTask = new Task();
        completedTask.setTitle("Completed Task");
        completedTask.setDescription("Completed Description");
        completedTask.setCompleted(true);
        completedTask.setCreatedAt(baseTime.plusMinutes(10));
        completedTask.setUser(testUser);
        entityManager.persistAndFlush(completedTask);

        List<Task> tasks = taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser);

        assertEquals(5, tasks.size());
        
        for (int i = 0; i < 4; i++) {
            assertTrue(tasks.get(i).getCreatedAt().isAfter(tasks.get(i + 1).getCreatedAt()) ||
                      tasks.get(i).getCreatedAt().equals(tasks.get(i + 1).getCreatedAt()));
        }

        tasks.forEach(task -> assertFalse(task.isCompleted()));
        
        tasks.forEach(task -> assertEquals(testUser.getId(), task.getUser().getId()));
    }

    @Test
    void testFindTop5ByUserAndCompletedFalseOrderByCreatedAtDesc_NoTasks() {
        List<Task> tasks = taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser);

        assertTrue(tasks.isEmpty());
    }

    @Test
    void testFindTop5ByUserAndCompletedFalseOrderByCreatedAtDesc_OnlyCompletedTasks() {
        Task completedTask1 = new Task();
        completedTask1.setTitle("Completed Task 1");
        completedTask1.setDescription("Description 1");
        completedTask1.setCompleted(true);
        completedTask1.setCreatedAt(LocalDateTime.now());
        completedTask1.setUser(testUser);
        entityManager.persistAndFlush(completedTask1);

        Task completedTask2 = new Task();
        completedTask2.setTitle("Completed Task 2");
        completedTask2.setDescription("Description 2");
        completedTask2.setCompleted(true);
        completedTask2.setCreatedAt(LocalDateTime.now().plusMinutes(1));
        completedTask2.setUser(testUser);
        entityManager.persistAndFlush(completedTask2);

        List<Task> tasks = taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser);

        assertTrue(tasks.isEmpty());
    }

    @Test
    void testFindTop5ByUserAndCompletedFalseOrderByCreatedAtDesc_LessThan5Tasks() {
        LocalDateTime baseTime = LocalDateTime.now();
        
        for (int i = 0; i < 3; i++) {
            Task task = new Task();
            task.setTitle("Task " + i);
            task.setDescription("Description " + i);
            task.setCompleted(false);
            task.setCreatedAt(baseTime.plusMinutes(i));
            task.setUser(testUser);
            entityManager.persistAndFlush(task);
        }

        List<Task> tasks = taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser);

        assertEquals(3, tasks.size());
    }

    @Test
    void testFindTop5ByUserAndCompletedFalseOrderByCreatedAtDesc_DifferentUsers() {
        LocalDateTime baseTime = LocalDateTime.now();
        
        for (int i = 0; i < 3; i++) {
            Task task = new Task();
            task.setTitle("TestUser Task " + i);
            task.setDescription("Description " + i);
            task.setCompleted(false);
            task.setCreatedAt(baseTime.plusMinutes(i));
            task.setUser(testUser);
            entityManager.persistAndFlush(task);
        }

        for (int i = 0; i < 2; i++) {
            Task task = new Task();
            task.setTitle("AnotherUser Task " + i);
            task.setDescription("Description " + i);
            task.setCompleted(false);
            task.setCreatedAt(baseTime.plusMinutes(i));
            task.setUser(anotherUser);
            entityManager.persistAndFlush(task);
        }

        List<Task> testUserTasks = taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(testUser);
        List<Task> anotherUserTasks = taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(anotherUser);

        assertEquals(3, testUserTasks.size());
        assertEquals(2, anotherUserTasks.size());

        testUserTasks.forEach(task -> assertEquals(testUser.getId(), task.getUser().getId()));
        anotherUserTasks.forEach(task -> assertEquals(anotherUser.getId(), task.getUser().getId()));
    }

    @Test
    void testSaveTask() {
        Task task = new Task();
        task.setTitle("New Task");
        task.setDescription("New Description");
        task.setCompleted(false);
        task.setCreatedAt(LocalDateTime.now());
        task.setUser(testUser);

        Task savedTask = taskRepository.save(task);

        assertNotNull(savedTask.getId());
        assertEquals("New Task", savedTask.getTitle());
        assertEquals("New Description", savedTask.getDescription());
        assertFalse(savedTask.isCompleted());
        assertEquals(testUser.getId(), savedTask.getUser().getId());
    }

    @Test
    void testFindById() {
        Task task = new Task();
        task.setTitle("Find By ID Task");
        task.setDescription("Description");
        task.setCompleted(false);
        task.setCreatedAt(LocalDateTime.now());
        task.setUser(testUser);
        Task savedTask = entityManager.persistAndFlush(task);

        Task foundTask = taskRepository.findById(savedTask.getId()).orElse(null);

        assertNotNull(foundTask);
        assertEquals("Find By ID Task", foundTask.getTitle());
        assertEquals(testUser.getId(), foundTask.getUser().getId());
    }
}
