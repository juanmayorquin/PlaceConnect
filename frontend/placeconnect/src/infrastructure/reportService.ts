import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/reports`
  : "http://localhost:5000/api/reports";

const api = axios.create({
  baseURL,
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postReport = (data: {
  propertyId: string;
  reason: string;
  comment?: string;
}) => api.post("/", data, { headers: { "Content-Type": "application/json", ...getAuthHeader() } });

export const fetchReports = () => api.get("/", { headers: getAuthHeader() });

export const actionReport = (id: string, decision: "invalid" | "removed") =>
  api.post(`/${id}/action`, { decision }, { headers: { "Content-Type": "application/json", ...getAuthHeader() } });
