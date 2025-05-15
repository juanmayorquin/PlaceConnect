import axios from "axios";
import type { Property } from "../domain/Property";

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/properties`
  : "http://localhost:5000/api/properties";

const api = axios.create({
  baseURL,
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface PropertyInput {
  title: string;
  description: string;
  price: number;
  type: "apartamento" | "casa" | "habitación" | "parqueo" | "bodega";
  conditions?: string;
  images: string[];
  status?: "disponible" | "pendiente" | "arrendado" | "inactivo";
}

// Crear un nuevo aviso enviando JSON
export const createProperty = (data: PropertyInput) =>
  api.post<PropertyInput>("/", data, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });

// Obtener mis avisos
export const getMyProperties = async () => {
  const res = await api.get<Property[]>("/me", { headers: getAuthHeader() });
  return res.data;
};

// Actualizar un aviso enviando JSON
export const updateProperty = (id: string, data: PropertyInput) =>
  api.put<PropertyInput>(`/${id}`, data, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });

// Eliminar un aviso
export const deleteProperty = (id: string) =>
  api.delete(`/${id}`, { headers: getAuthHeader() });

// Moderación (admin)
export const listPending = async () => {
  const res = await api.get<Property[]>("/pending", { headers: getAuthHeader() });
  return res.data;
};

export const moderateProperty = (
  id: string,
  action: "approve" | "reject",
  reason?: string
) =>
  api.post(
    `/${id}/moderate`,
    { action, reason },
    { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
  );
