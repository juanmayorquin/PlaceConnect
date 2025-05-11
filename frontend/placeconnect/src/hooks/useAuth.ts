import { useState } from 'react';

export interface AuthUser { id: string; email: string; role: 'owner' | 'renter' }

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  // lógica para token, localStorage, validación, etc.
  return { user, setUser };
};