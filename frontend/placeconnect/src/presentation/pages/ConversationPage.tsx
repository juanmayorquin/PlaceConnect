/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { sendMessage, getMessages } from "../../infrastructure/messageService";
import { getPropDetail as getProperty } from "../../infrastructure/searchService";
import { requestAgreement } from "../../infrastructure/agreementService";
import { uploadFile } from "../../infrastructure/firebaseStorageService";
import type { Message } from "../../domain/Message";

const ConversationPage: React.FC = () => {
  const { otherId, propertyId } = useParams<{
    otherId: string;
    propertyId: string;
  }>();
  const { user } = useAuth();

  // Estados para mensajes
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  // Estados para cargar propiedad
  const [property, setProperty] = useState<any>(null);
  const [propertyError, setPropertyError] = useState("");
  const [loadingProperty, setLoadingProperty] = useState(true);

  // Estados para modal de solicitud de contrato
  const [showModal, setShowModal] = useState(false);
  const [startDateReq, setStartDateReq] = useState("");
  const [endDateReq, setEndDateReq] = useState("");
  const [filePdf, setFilePdf] = useState<File | null>(null);
  const [errorReq, setErrorReq] = useState("");
  const [sendingReq, setSendingReq] = useState(false);

  // Determina si el usuario autenticado es el dueño de la propiedad
  const propOwnerId = property?.owner._id;
  const agreementReady = !loadingProperty && propOwnerId === user?.id;

  // Función para cargar mensajes de la conversación
  const loadMessages = () => {
    if (otherId && propertyId) {
      getMessages(otherId, propertyId)
        .then((res) => setMsgs(res.data))
        .catch((err) => console.error("Error al cargar mensajes:", err));
    }
  };

  // Carga inicial de mensajes y propiedad
  useEffect(() => {
    loadMessages();
  }, [otherId, propertyId]);

  useEffect(() => {
    if (propertyId) {
      setLoadingProperty(true);
      getProperty(propertyId)
        .then((res: { data: any; }) => {
          setProperty(res.data);
          setPropertyError("");
        })
        .catch(() => {
          setPropertyError("No se pudo cargar la propiedad");
          setProperty(null);
        })
        .finally(() => {
          setLoadingProperty(false);
        });
    }
  }, [propertyId]);

  // Handler para enviar nuevo mensaje
  const handleSend = async () => {
    if (!otherId || !propertyId || content.trim() === "") return;
    try {
      await sendMessage({
        receiverId: otherId,
        propertyId: propertyId,
        content: content.trim(),
      });
      setContent("");
      loadMessages();
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  // Handler al seleccionar archivo PDF
  const handleFileChangeReq = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilePdf(e.target.files[0]);
    }
  };

  // Handler para enviar la solicitud de contrato
  const handleRequestAgreement = async () => {
    if (!otherId || !propertyId) return;
    if (!startDateReq || !endDateReq) {
      setErrorReq("Selecciona fecha de inicio y fin");
      return;
    }
    if (new Date(endDateReq) < new Date(startDateReq)) {
      setErrorReq("La fecha de fin debe ser posterior a la de inicio");
      return;
    }
    setErrorReq("");
    setSendingReq(true);
    try {
      // Si hay PDF, súbelo a Firebase y obtén URL
      let contractUrl: string | undefined;
      if (filePdf) {
        const path = `contracts/${user!.id}/${Date.now()}_${filePdf.name}`;
        contractUrl = await uploadFile(filePdf, path);
      }

      await requestAgreement({
        propertyId,
        tenantId: otherId,
        startDate: startDateReq,
        endDate: endDateReq,
        contractUrl,
      });

      setShowModal(false);
      alert("Solicitud de contrato enviada al inquilino");
    } catch (err: any) {
      console.error(err);
      setErrorReq(err.response?.data?.msg || "Error al solicitar contrato");
    } finally {
      setSendingReq(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      {/* Mensajes */}
      <div className="mb-4 max-h-80 overflow-y-auto">
        {msgs.map((m) => (
          <div
            key={m._id}
            className={m.senderId === user?.id ? "text-right" : "text-left"}
          >
            <p className="inline-block p-2 bg-slate-200 rounded">{m.content}</p>
          </div>
        ))}
      </div>

      {/* Input para enviar mensajes */}
      <div className="flex gap-2 mb-6">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <Button onClick={handleSend}>Enviar</Button>
      </div>

      {/* Error al cargar propiedad */}
      {propertyError && (
        <p className="text-red-600 mb-4">{propertyError}</p>
      )}

      {/* Botón “Enviar Contrato” solo si el usuario es propietario */}
      {!loadingProperty && agreementReady && (
        <div className="mb-4">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Enviar Contrato
          </Button>
        </div>
      )}

      {/* Modal para Solicitud de Contrato */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Enviar Contrato</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">
                  Fecha de Inicio
                </label>
                <Input
                  type="date"
                  value={startDateReq}
                  onChange={(e) => setStartDateReq(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Fecha de Fin
                </label>
                <Input
                  type="date"
                  value={endDateReq}
                  onChange={(e) => setEndDateReq(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Contrato (PDF opcional)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChangeReq}
                  className="mt-1"
                />
              </div>
              {errorReq && <p className="text-red-600">{errorReq}</p>}
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="contrast"
                  onClick={() => setShowModal(false)}
                  disabled={sendingReq}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRequestAgreement}
                  disabled={sendingReq}
                >
                  {sendingReq ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConversationPage;
