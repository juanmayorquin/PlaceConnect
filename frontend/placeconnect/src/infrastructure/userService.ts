import axios from "axios";

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/api/users` });

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProfile = () => api.get("/me", { headers: getAuthHeader() });
export const updateProfile = (
  data: Partial<{
    name: string;
    email: string;
    password?: string;
    profileImageUrl?: string;
  }>
) => api.put("/me", data, { headers: getAuthHeader() });
export const deleteProfile = () => api.delete("/me", { headers: getAuthHeader() });
