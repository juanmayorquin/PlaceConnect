export interface Property {
  _id: string;
  owner: string;
  title: string;
  description: string;
  price: number;
  type: "apartamento" | "casa" | "habitación" | "parqueo" | "bodega";
  conditions?: string;
  images: string[];
  status: "disponible" | "pendiente" | "arrendado" | "inactivo";
  createdAt: string;
  updatedAt: string;
}
