package com.example.demo.controller;

import com.example.demo.dto.CreateTaskDTO;
import com.example.demo.dto.ResponseTaskDTO;
import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ResponseTaskDTO> createTask(@RequestBody CreateTaskDTO createTaskDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        Task task = new Task();
        task.setTitle(createTaskDTO.getTitle());
        task.setDescription(createTaskDTO.getDescription());
        task.setUser(user);
        task.setCreatedAt(LocalDateTime.now());
        Task savedTask = taskRepository.save(task);

        ResponseTaskDTO responseDTO = new ResponseTaskDTO();
        responseDTO.setId(savedTask.getId());
        responseDTO.setTitle(savedTask.getTitle());
        responseDTO.setDescription(savedTask.getDescription());
        responseDTO.setCompleted(savedTask.isCompleted());
        responseDTO.setCreatedAt(savedTask.getCreatedAt());

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<ResponseTaskDTO>> getTasks() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        List<Task> tasks = taskRepository.findTop5ByUserAndCompletedFalseOrderByCreatedAtDesc(user);

        List<ResponseTaskDTO> taskDTOs = tasks.stream().map(task -> {
            ResponseTaskDTO dto = new ResponseTaskDTO();
            dto.setId(task.getId());
            dto.setTitle(task.getTitle());
            dto.setDescription(task.getDescription());
            dto.setCompleted(task.isCompleted());
            dto.setCreatedAt(task.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(taskDTOs);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        Task task = taskRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(true);
        taskRepository.save(task);

        return ResponseEntity.ok().build();
    }
}

