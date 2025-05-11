import { useState } from 'react';

export interface AuthUser { id: string; email: string; role: 'Propietario' | 'Interesado' }

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  // lógica para token, localStorage, validación, etc.
  return { user, setUser };
};