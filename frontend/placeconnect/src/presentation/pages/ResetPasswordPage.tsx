/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../infrastructure/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setMessage(''); setError(''); setLoading(true);
    try {
      await resetPassword( token!, password );
      setMessage('Contraseña restablecida. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Restablecer Contraseña</h2>
        <Input
          label="Nueva contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;