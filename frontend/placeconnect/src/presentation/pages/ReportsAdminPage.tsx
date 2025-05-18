import React, { useEffect, useState } from 'react';
import { fetchReports, actionReport } from '../../infrastructure/reportService';
import Button from '../ui/Button';

interface ReportItem {
  _id: string;
  propertyId: { _id: string; title: string };  // populated
  reporterId: { _id: string; name: string; email: string };
  reason: string;
  comment?: string;
  reviewed: boolean;
  decision?: 'invalid' | 'removed';
  createdAt: string;
}

const ReportsAdminPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const load = async () => {
    const res = await fetchReports();
    setReports(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDecision = async (id: string, decision: 'invalid' | 'removed') => {
    await actionReport(id, decision);
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reportes</h1>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Propiedad</th>
            <th className="px-4 py-2">Reportado por</th>
            <th className="px-4 py-2">Motivo</th>
            <th className="px-4 py-2">Comentario</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r._id} className="border-t">
              <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">{r.propertyId.title}</td>
              <td className="px-4 py-2">{r.reporterId.name} ({r.reporterId.email})</td>
              <td className="px-4 py-2">{r.reason}</td>
              <td className="px-4 py-2">{r.comment || '-'}</td>
              <td className="px-4 py-2">{r.reviewed ? r.decision : 'Pendiente'}</td>
              <td className="px-4 py-2 space-x-2">
                {!r.reviewed && (
                  <>
                    <Button onClick={() => handleDecision(r._id, 'invalid')}>Marcar Inválido</Button>
                    <Button variant="contrast" onClick={() => handleDecision(r._id, 'removed')}>Eliminar Publicación</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsAdminPage;