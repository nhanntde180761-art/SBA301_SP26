import axios from 'axios';

const API_URL = "http://localhost:5000"; 
const orchidUrl = `${API_URL}/orchids`;
const userUrl = `${API_URL}/users`;
const categorieUrl = `${API_URL}/categories`; // Sửa thành số nhiều cho khớp db.json

export const orchidService = {
  // --- QUẢN LÝ HOA LAN (ORCHIDS) ---
  getAll: () => axios.get(orchidUrl),

  getById: (id) => axios.get(`${orchidUrl}/${id}`),

  create: (data) => axios.post(orchidUrl, data),

  update: (id, data) => axios.put(`${orchidUrl}/${id}`, data),

  delete: (id) => axios.delete(`${orchidUrl}/${id}`),

  // --- QUẢN LÝ NGƯỜI DÙNG (USERS) ---
  getUsers: () => axios.get(userUrl),

  // --- QUẢN LÝ DANH MỤC (CATEGORIES) ---
  // Lấy danh mục để đổ vào Dropdown (Select)
  getCategories: () => axios.get(categorieUrl),
};