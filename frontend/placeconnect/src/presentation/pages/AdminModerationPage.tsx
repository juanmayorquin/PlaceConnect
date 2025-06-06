import React, { useEffect, useState } from 'react';
import { listPending, moderateProperty } from '../../infrastructure/propertyService';
import Button from '../ui/Button';
import type { Property } from '../../domain/Property';

const AdminModerationPage: React.FC = () => {
  const [items, setItems] = useState<Property[]>([]);
  useEffect(() => {
    listPending().then((res: Property[]) => setItems(res));
  }, []);

  const handleModerate = async (id: string, action: 'approve'|'reject') => {
    const reason = action === 'reject' ? prompt('Motivo de rechazo') || '' : '';
    await moderateProperty(id, action, reason);
    setItems(items.filter(i => i._id !== id));
  };

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold mb-6">Moderación de Avisos</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item._id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm">{item.description}</p>
            <div className="text-xs text-slate-600 mb-1">
              Baños: {item.bathrooms} | Habitaciones: {item.bedrooms} | Torre: {item.location?.tower} | Apartamento: {item.location?.apartment} | Área: {item.area} m²
            </div>
            {item.keypoints && item.keypoints.length > 0 && (
              <div className="mb-1">
                <span className="font-semibold">Puntos clave:</span>
                <ul className="list-disc ml-6">
                  {item.keypoints.map((kp: string, i: number) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2 space-x-2">
              <Button onClick={() => handleModerate(item._id, 'approve')}>Aprobar</Button>
              <Button variant="contrast" onClick={() => handleModerate(item._id, 'reject')}>Rechazar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminModerationPage;