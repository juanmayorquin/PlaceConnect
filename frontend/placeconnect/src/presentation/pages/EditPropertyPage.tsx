import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import { getMyProperties, updateProperty, type PropertyInput } from '../../infrastructure/propertyService';
import type { Property } from '../../domain/Property';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<Property>();
  const nav = useNavigate();

  useEffect(() => {
    getMyProperties().then((res: Property[]) => {
      const prop = res.find((p: Property) => p._id === id);
      setData(prop);
    });
  }, [id]);

  const handleUpdate = async (data: PropertyInput) => {
    await updateProperty(id!, data);
    nav('/properties/me');
  };

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Editar Aviso</h1>
      {data && <PropertyForm initialData={data} onSubmit={handleUpdate} submitLabel="Guardar Cambios" />}
    </div>
  );
};
export default EditPropertyPage;