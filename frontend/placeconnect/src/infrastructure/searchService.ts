/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/search/properties`
  : "http://localhost:5000/api/search/properties";

const api = axios.create({
  baseURL,
});

export const searchProps = (filters: any) => api.get("/", { params: filters });

export const getPropDetail = (id: string) => api.get(`/${id}`);