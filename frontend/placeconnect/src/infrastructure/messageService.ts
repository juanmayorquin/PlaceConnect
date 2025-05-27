import axios from "axios";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/messages`,
});

const getAuth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const sendMessage = (data: {
  receiverId: string;
  propertyId: string;
  content: string;
}) => api.post("/", data, { headers: getAuth() });

export const getConversations = () =>
  api.get<string[]>("/conversations", { headers: getAuth() });

export const getMessages = (otherId: string, propertyId: string) =>
  api.get(`/${otherId}/${propertyId}`, { headers: getAuth() });
