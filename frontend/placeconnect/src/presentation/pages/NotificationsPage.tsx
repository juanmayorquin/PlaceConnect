/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotification,
} from "../../infrastructure/notificationService";
import {
  acceptAgreement,
  rejectAgreement,
} from "../../infrastructure/agreementService";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

const NotificationsPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAgrId, setSelectedAgrId] = useState<string | null>(null);

  const load = () => fetchNotifications().then((r) => setNotes(r.data));
  useEffect(() => {
    load();
  }, []);

  // Abrir modal y guardar agreementId
  const handleOpenModal = (agrId: string) => {
    setSelectedAgrId(agrId);
    setShowModal(true);
  };

  // Aceptar contrato
  const handleAccept = async () => {
    if (!selectedAgrId) return;
    await acceptAgreement(selectedAgrId);
    setShowModal(false);
    setSelectedAgrId(null);
    load();
    alert("Contrato aceptado");
  };

  // Rechazar contrato
  const handleReject = async () => {
    if (!selectedAgrId) return;
    await rejectAgreement(selectedAgrId);
    setShowModal(false);
    setSelectedAgrId(null);
    load();
    alert("Contrato rechazado");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      <ul>
        {notes.map((n) => (
          <li key={n._id} className="border-b py-2 flex justify-between">
            <div className="flex-1">
              {/* 1) solicitud de contrato */}
              {n.type === "agreement-request" && (
                <>
                  <p>
                    El propietario envió un contrato para la propiedad{" "}
                    <strong>{n.agreementId.propertyTitle}</strong>
                  </p>
                  <small>{new Date(n.createdAt).toLocaleString()}</small>
                </>
              )}
              {/* 2) contrato aceptado */}
              {n.type === "agreement-accepted" && (
                <p>Tu contrato fue aceptado por el propietario</p>
              )}
              {/* 3) mensajes */}
              {n.type === "message" && (
                <p>Nuevo mensaje: "{n.messageId.content}"</p>
              )}
            </div>
            <div className="flex-shrink-0 space-x-2">
              {/* Solo mostrar botones si es solicitud de contrato y no está leída */}
              {n.type === "agreement-request" && !n.read && (
                <Button onClick={() => handleOpenModal(n.agreementId._id)}>
                  Revisar Contrato
                </Button>
              )}
              {/* Para otros tipos: marcar leído */}
              {!n.read && n.type !== "agreement-request" && (
                <Button onClick={() => markNotification(n._id).then(load)}>
                  Marcar leído
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de confirmación (Aceptar / Rechazar) */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              Revisar Solicitud de Contrato
            </h2>
            <p>¿Deseas aceptar o rechazar este contrato?</p>
            <div className="mt-6 flex justify-end space-x-2">
              
              <Button onClick={handleReject} variant="contrast">
                Rechazar
              </Button>
              <Button onClick={handleAccept}>Aceptar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NotificationsPage;
