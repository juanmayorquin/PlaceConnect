/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postReview } from '../../infrastructure/reviewService';
import Button from '../ui/Button';
import { Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/AuthContext';

const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // agreementId
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [agreement, setAgreement] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/agreements/${id}`)
      .then((res) => setAgreement(res.data))
      .catch(() => setError('No se pudo cargar el acuerdo'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await postReview({ agreementId: id!, rating, comment });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al enviar la calificación');
    }
  };

  if (loading) return <div className="text-center p-6">Cargando...</div>;

  const isTenant = user?.id === agreement?.tenantId;
  const title = isTenant ? 'Califica la propiedad' : 'Califica al inquilino';

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((st) => (
            <Star
              key={st}
              className={`h-6 w-6 cursor-pointer ${rating >= st ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setRating(st)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="input w-full"
          placeholder="Comentario (opcional)"
        />
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" variant="primary" fullWidth>
          Enviar Calificación
        </Button>
      </form>
    </div>
  );
};

export default ReviewPage;