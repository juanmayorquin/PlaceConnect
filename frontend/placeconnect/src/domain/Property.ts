export interface Property {
  _id: string;
  owner: string;
  title: string;
  description: string;
  price: number;
  type: "apartamento" | "casa" | "habitación" | "parqueo" | "bodega";
  keypoints: string[];
  bathrooms: number;
  bedrooms: number;
  images: string[];
  status: "disponible" | "pendiente" | "arrendado" | "inactivo";
  createdAt: string;
  updatedAt: string;
  location: {
    tower: number;
    apartment: number;
  };
  area: number;
}
