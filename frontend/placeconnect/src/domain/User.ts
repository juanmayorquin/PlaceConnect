export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Propietario' | 'Interesado' | 'Admin';
  profileImageUrl?: string;
  averageScore?: number;
  reviewCount?: number;
}