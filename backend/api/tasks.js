import { tasks } from "../../data"; // Simpan data di file terpisah

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.json(tasks);
  }
  
  if (req.method === "POST") {
    const newTask = {
      id: tasks.length + 1,
      task_name: req.body.task_name,
      status: req.body.status || "Pending",
    };
    tasks.push(newTask);
    return res.status(201).json(newTask);
  }

  if (req.method === "PUT") {
    const taskId = parseInt(req.query.id);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = req.body.status || task.status;
    return res.json(task);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
