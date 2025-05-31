import axios from 'axios';
const base = import.meta.env.VITE_API_URL + '/api/reviews';
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const postReview = (data: {
  agreementId: string; rating: number; comment?: string;
}) => axios.post(base, data, { headers: auth() });