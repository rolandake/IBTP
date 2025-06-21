
jsx
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // adapte si besoin
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("btp-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

