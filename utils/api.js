import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

export const loginUser = (userData) => API.post("/auth/login", userData);
export const registerUser = (userData) => API.post("/auth/register", userData);
export const getUser = () => API.get("/auth/me");
