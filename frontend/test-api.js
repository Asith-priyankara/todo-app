#!/usr/bin/env node

/**
 * API Test Script
 * This script tests the backend API endpoints to ensure they're working correctly.
 * Run this script after starting the backend server.
 */

const axios = require("axios");

const API_BASE_URL = "http://localhost:8080/api";

const testUser = {
  email: "test@example.com",
  password: "testpassword123",
  fullName: "Test User",
};

const testTask = {
  title: "Test Task",
  description: "This is a test task created by the API test script",
};

async function testAPI() {
  console.log("Starting API Tests...\n");

  try {
    console.log("Testing User Registration...");
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      console.log("Registration successful");
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.includes("already exists")
      ) {
        console.log("User already exists (expected for repeated tests)");
      } else {
        throw error;
      }
    }

    console.log("Testing User Login...");
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    const token = loginResponse.data;
    console.log("Login successful, token received");

    const authenticatedAxios = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Testing Task Creation...");
    const createTaskResponse = await authenticatedAxios.post(
      "/tasks",
      testTask
    );
    const createdTask = createTaskResponse.data;
    console.log("Task created successfully:", createdTask.title);

    console.log("Testing Get Tasks...");
    const getTasksResponse = await authenticatedAxios.get("/tasks");
    const tasks = getTasksResponse.data;
    console.log(`Retrieved ${tasks.length} tasks`);

    if (tasks.length > 0) {
      console.log("Testing Task Completion...");
      const taskToComplete = tasks[0];
      await authenticatedAxios.put(`/tasks/${taskToComplete.id}/complete`);
      console.log("Task completed successfully");
    }

    console.log("All API tests passed successfully!");
    console.log("Test Summary:");
    console.log("User Registration");
    console.log("User Login");
    console.log("Task Creation");
    console.log("Get Tasks");
    if (tasks.length > 0) {
      console.log("  Task Completion");
    }
    console.log(
      "\n✨ The frontend should now work correctly with the backend!"
    );
  } catch (error) {
    console.error(" API Test Failed:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error("No response received. Is the backend server running?");
    } else {
      console.error(`Error: ${error.message}`);
    }
    console.log("Troubleshooting:");
    console.log(
      "  1. Ensure the backend server is running on http://localhost:8080"
    );
    console.log("  2. Check that all required dependencies are installed");
    console.log("  3. Verify the database connection is working");
  }
}

testAPI();
