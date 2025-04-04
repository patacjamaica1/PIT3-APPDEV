import React, { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      await fetch("http://127.0.0.1:8000/api/todos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTask.trim(), completed: false }),
      });
      fetchTasks(); // Refresh the task list
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const startEditing = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, editing: true, editText: task.text } : task)));
  };

  const confirmEdit = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (!task || !task.editText.trim()) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, text: task.editText }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? { ...updatedTask, editing: false } : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/todos/${id}/`, { method: "DELETE" });
      fetchTasks(); // Refresh the task list after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <h2>To-Do List</h2>
      <div className="task-input">
        <input type="text" placeholder="Add a new task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
            {task.editing ? (
              <>
                <input
                  type="text"
                  value={task.editText || ""}
                  onChange={(e) =>
                    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, editText: e.target.value } : t)))
                  }
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit(task.id)}
                  autoFocus
                />
                <button onClick={() => confirmEdit(task.id)}>Save</button>
              </>
            ) : (
              <span>{task.text}</span>
            )}
            <button className="edit-btn" onClick={() => startEditing(task.id)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="filter-buttons">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
        <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>Pending</button>
      </div>
    </div>
  );
};

export default App;
