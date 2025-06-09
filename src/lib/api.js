import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Đổi nếu BE chạy port khác

export async function registerUser(data) {
  // FE gửi đúng các trường: firstName, lastName, email, phone, password, location
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
} 