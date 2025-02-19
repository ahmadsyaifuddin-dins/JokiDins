import axios from "axios";

const API_URL = "https://joki-dins.vercel.app"; // Ganti dengan URL API-mu

// 🔹 GET Semua Task
export const getTasks = async () => {
  const res = await axios.get(`${API_URL}/tasks`);
  return res.data;
};

// 🔹 GET Task by ID
export const getTaskById = async (id) => {
  const res = await axios.get(`${API_URL}/tasks/${id}`);
  return res.data;
};

// 🔹 POST Task Baru
export const createTask = async (taskData) => {
  const res = await axios.post(`${API_URL}/tasks`, taskData);
  return res.data;
};

// 🔹 PUT Update Task
export const updateTask = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/tasks/${id}`, updatedData);
  return res.data;
};

// 🔹 DELETE Task
export const deleteTask = async (id) => {
  const res = await axios.delete(`${API_URL}/tasks/${id}`);
  return res.data;
};
