import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/notifications`,
});

const getAuth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchNotifications = () => api.get("/", { headers: getAuth() });

export const markNotification = (id: string) =>
  api.post(`/${id}/read`, {}, { headers: getAuth() });
