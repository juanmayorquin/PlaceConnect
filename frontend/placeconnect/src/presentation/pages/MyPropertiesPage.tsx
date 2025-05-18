import React, { useEffect, useState } from "react";
import {
  getMyProperties,
  deleteProperty,
} from "../../infrastructure/propertyService";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import type { Property } from "../../domain/Property";

const MyPropertiesPage: React.FC = () => {
  const [props, setProps] = useState<Property[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    getMyProperties().then((res: Property[]) => setProps(res));
  }, []);

  const handleDelete = async (_id: string) => {
    if (confirm("¿Eliminar este aviso?")) {
      await deleteProperty(_id);
      setProps(props.filter((p) => p._id !== _id));
    }
  };

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold mb-4">Mis Avisos</h1>
      <Button onClick={() => nav("/properties/new")} variant="primary">
        + Nuevo Aviso
      </Button>
      <div className="mt-6 grid gap-4">
        {props.map((p) => (
          <div
            key={p._id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-sm text-slate-600">${p.price}</p>
              <div className="text-xs text-slate-600 mb-1">
                Baños: {p.bathrooms} | Habitaciones: {p.bedrooms} | Torre:{" "}
                {p.location?.tower} | Apartamento: {p.location?.apartment} | Área:{" "}
                {p.area} m²
              </div>
              {p.keypoints && p.keypoints.length > 0 && (
                <div className="mb-1">
                  <span className="font-semibold">Puntos clave:</span>
                  <ul className="list-disc ml-6">
                    {p.keypoints.map((kp: string, i: number) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-x-2">
              <Link to={`/properties/${p._id}/edit`} className="text-blue-600">
                Editar
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyPropertiesPage;
