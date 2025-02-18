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

