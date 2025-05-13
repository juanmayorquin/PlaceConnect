import axios from "axios";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
});

export const register = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => api.post("/register", data);

export const verify = (token: string) => api.get(`/verify/${token}`);

export const login = (data: { email: string; password: string }) =>
  api.post("/login", data);

export const requestReset = (email: string) =>
  api.post("/request-reset", { email });

export const resetPassword = (token: string, password: string) =>
  api.post(`/reset/${token}`, { password });
