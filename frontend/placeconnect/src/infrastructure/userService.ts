import axios from 'axios';

export const getProfile = () => axios.get('/api/users/me');
export const updateProfile = (data: Partial<{ name: string; email: string; password: string }>) =>
  axios.put('/api/users/me', data);
export const deleteProfile = () => axios.delete('/api/users/me');