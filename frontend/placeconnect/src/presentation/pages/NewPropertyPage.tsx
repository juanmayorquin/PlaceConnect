import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import { createProperty, type PropertyInput } from '../../infrastructure/propertyService';

const NewPropertyPage: React.FC = () => {
  const nav = useNavigate();
  const handleCreate = async (data: PropertyInput) => {
    await createProperty(data);
    nav('/properties/me');
  };
  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Nuevo Aviso</h1>
      <PropertyForm onSubmit={handleCreate} submitLabel="Publicar Aviso" />
    </div>
  );
};
export default NewPropertyPage;