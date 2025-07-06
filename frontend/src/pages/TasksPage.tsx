import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { tasksAPI } from "../services/api";
import type { TaskResponse } from "../types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const fetchedTasks = await tasksAPI.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      setIsCreating(true);
      setError("");
      const newTask = await tasksAPI.createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
      });

      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create task"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const completeTask = async (taskId: number) => {
    try {
      setError("");

      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      await tasksAPI.completeTask(taskId);

      const freshTasks = await tasksAPI.getTasks();
      setTasks(freshTasks);
    } catch (error) {
      const freshTasks = await tasksAPI.getTasks();
      setTasks(freshTasks);
      setError(
        error instanceof Error ? error.message : "Failed to complete task"
      );
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Task Manager
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="h-fit shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Add a Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-lg transition-all duration-200"
                  />
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter task description..."
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-3 border border-indigo-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 transition-all duration-200 bg-white/70"
                  />
                </div>
                <Button
                  onClick={addTask}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={!newTaskTitle.trim() || isCreating}
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding Task...
                    </span>
                  ) : (
                    "Add"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading tasks...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks
                  .filter((task) => !task.completed)
                  .slice(0, 5)
                  .map((task, index) => (
                    <Card
                      key={task.id}
                      className="bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/80"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  index % 4 === 0
                                    ? "bg-gradient-to-r from-pink-400 to-rose-500"
                                    : index % 4 === 1
                                    ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                                    : index % 4 === 2
                                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                    : "bg-gradient-to-r from-purple-400 to-violet-500"
                                }`}
                              />
                              <h3 className="text-lg font-bold text-gray-800">
                                {task.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed pl-6">
                              {task.description || "No description provided"}
                            </p>
                          </div>
                          <Button
                            onClick={() => completeTask(task.id)}
                            size="sm"
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white ml-4 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-semibold"
                          >
                            Done ✓
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {tasks.filter((task) => !task.completed).length === 0 && (
                  <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200">
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-600 text-lg font-medium">
                        No pending tasks!
                      </p>
                      <p className="text-gray-500 mt-2">
                        Add a new task to get started on your journey.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
