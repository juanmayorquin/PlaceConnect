export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Propietario" | "Interesado";
}