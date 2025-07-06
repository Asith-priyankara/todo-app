package com.example.demo.repository;

import com.example.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPassword("password123");
    }

    @Test
    void testFindByEmail_Success() {
        entityManager.persistAndFlush(testUser);

        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        assertTrue(foundUser.isPresent());
        assertEquals("test@example.com", foundUser.get().getEmail());
        assertEquals("Test User", foundUser.get().getFullName());
        assertEquals("password123", foundUser.get().getPassword());
    }

    @Test
    void testFindByEmail_NotFound() {
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

        assertFalse(foundUser.isPresent());
    }

    @Test
    void testFindByEmail_EmptyEmail() {
        Optional<User> foundUser = userRepository.findByEmail("");

        assertFalse(foundUser.isPresent());
    }

    @Test
    void testFindByEmail_NullEmail() {
        Optional<User> foundUser = userRepository.findByEmail(null);

        assertFalse(foundUser.isPresent());
    }

    @Test
    void testSaveUser() {
        User savedUser = userRepository.save(testUser);

        assertNotNull(savedUser.getId());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("Test User", savedUser.getFullName());
        assertEquals("password123", savedUser.getPassword());
    }

    @Test
    void testFindByEmail_CaseInsensitive() {
        entityManager.persistAndFlush(testUser);

        Optional<User> foundUser = userRepository.findByEmail("TEST@EXAMPLE.COM");

        
        assertFalse(foundUser.isPresent()); 
    }

    @Test
    void testMultipleUsers() {
        User user2 = new User();
        user2.setEmail("user2@example.com");
        user2.setFullName("User Two");
        user2.setPassword("password456");

        entityManager.persistAndFlush(testUser);
        entityManager.persistAndFlush(user2);

        Optional<User> foundUser1 = userRepository.findByEmail("test@example.com");
        Optional<User> foundUser2 = userRepository.findByEmail("user2@example.com");

        assertTrue(foundUser1.isPresent());
        assertTrue(foundUser2.isPresent());
        assertEquals("Test User", foundUser1.get().getFullName());
        assertEquals("User Two", foundUser2.get().getFullName());
    }

    @Test
    void testEmailUniqueness() {
        entityManager.persistAndFlush(testUser);

        User duplicateEmailUser = new User();
        duplicateEmailUser.setEmail("test@example.com");
        duplicateEmailUser.setFullName("Another User");
        duplicateEmailUser.setPassword("anotherPassword");

        assertThrows(Exception.class, () -> {
            entityManager.persistAndFlush(duplicateEmailUser);
        });
    }

    @Test
    void testDeleteUser() {
        User savedUser = entityManager.persistAndFlush(testUser);
        Long userId = savedUser.getId();

        userRepository.deleteById(userId);
        entityManager.flush();

        Optional<User> deletedUser = userRepository.findById(userId);
        assertFalse(deletedUser.isPresent());
    }
}
