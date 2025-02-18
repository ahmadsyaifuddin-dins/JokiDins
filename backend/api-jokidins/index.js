const express = require("express");
const app = express();

// Mock Data untuk tugas joki
const tasks = [
  { id: 1, task_name: "Pembuatan Website", status: "Pending" },
  { id: 2, task_name: "Pembuatan Aplikasi Mobile", status: "Progress" },
  { id: 3, task_name: "Bantu Tugas Kuliah", status: "Selesai" },
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

module.exports = app;


app.use(express.json()); // Middleware untuk parse JSON
app.post("/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1, // Increment ID
    task_name: req.body.task_name,
    status: req.body.status || "Pending", // Default status adalah 'Pending'
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.status = req.body.status || task.status; // Update status
  res.json(task);
});


app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(taskIndex, 1); // Menghapus tugas
  res.status(204).send(); // Mengirimkan response kosong (No Content)
});
