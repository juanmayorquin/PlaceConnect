/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
const base = import.meta.env.VITE_API_URL + '/api/agreements';
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const postAgreement = (data: {
  propertyId: string; tenantId: string;
  startDate: string; endDate: string; contractUrl?: string;
}) => axios.post(base, data, { headers: auth() });

export const editAgreement = (id: string, data: any) =>
  axios.put(`${base}/${id}`, data, { headers: auth() });

export const cancelAgreement = (id: string, reasonCancel: string) =>
  axios.post(`${base}/${id}/cancel`, { reasonCancel }, { headers: auth() });

export const requestAgreement = (data: {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  contractUrl?: string;
}) => axios.post(base + '/request', data, { headers: auth() });

export const acceptAgreement = (id: string) =>
  axios.post(`${base}/${id}/accept`, {}, { headers: auth() });

export const rejectAgreement = (id: string) =>
  axios.post(`${base}/${id}/reject`, {}, { headers: auth() });
