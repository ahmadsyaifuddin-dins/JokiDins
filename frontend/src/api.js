import axios from "axios";

const API_URL = "https://joki-dins.vercel.app"; // Ganti dengan URL API-mu

// 🔹 GET Semua Task
export const getTasks = async () => {
  const res = await axios.get(`https://jokidins-production.up.railway.app/tasks`);
  return res.data;
};

// 🔹 GET Task by ID
export const getTaskById = async (id) => {
  const res = await axios.get(`https://jokidins-production.up.railway.app/tasks/${id}`);
  return res.data;
};

// 🔹 POST Task Baru
export const createTask = async (taskData) => {
  const res = await axios.post(`https://jokidins-production.up.railway.app/tasks`, taskData);
  return res.data;
};

// 🔹 PUT Update Task
export const updateTask = async (id, updatedData) => {
  const res = await axios.put(`https://jokidins-production.up.railway.app/tasks/${id}`, updatedData);
  return res.data;
};

// 🔹 DELETE Task
export const deleteTask = async (id) => {
  const res = await axios.delete(`https://jokidins-production.up.railway.app/tasks/${id}`);
  return res.data;
};
