/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { getPropDetail } from "../../infrastructure/searchService";
import { postReport } from "../../infrastructure/reportService";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../../hooks/AuthContext";
import { sendMessage } from "../../infrastructure/messageService";

const PropertyDetailPage: React.FC = () => {
  const nav = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [prop, setProp] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const load = async () => setProp((await getPropDetail(id!)).data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
  }, [id]);
  const handleReport = async () => {
    await postReport({ propertyId: id!, reason, comment });
    alert("Reporte enviado");
    setReason("");
    setComment("");
  };

  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState("");
  const [feedback, setFeedback] = useState("");
  const handleContact = async () => {
    if (!prop || !user || !messageContent.trim()) return;
    try {
      await sendMessage({
        receiverId: prop.owner._id,
        propertyId: prop._id,
        content: messageContent,
      });
      nav(`/conversations/${prop.owner._id}/${prop._id}`);

      setFeedback("Mensaje enviado correctamente");
    } catch {
      setFeedback("Error al enviar el mensaje");
    }
  };

  if (!prop) return <p>Cargando...</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{prop.title}</h1>
      <p className="mb-4">{prop.description}</p>
      <p className="font-semibold mb-2">Precio: ${prop.price}</p>
      <div className="mb-2 flex gap-4">
        <span>Baños: {prop.bathrooms}</span>
        <span>Habitaciones: {prop.bedrooms}</span>
        <span>Torre: {prop.location?.tower}</span>
        <span>Apartamento: {prop.location?.apartment}</span>
        <span>Área: {prop.area} m²</span>
      </div>
      {prop.keypoints && prop.keypoints.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Puntos clave:</span>
          <ul className="list-disc ml-6">
            {prop.keypoints.map((kp: string, i: number) => (
              <li key={i}>{kp}</li>
            ))}
          </ul>
        </div>
      )}
      {user && user.id !== prop.owner._id && (
        <div className="mt-6 p-4 bg-slate-100 rounded">
          <h2 className="font-semibold mb-2">Contactar al propietario</h2>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="input w-full mb-2"
            rows={3}
          />
          <Button onClick={handleContact}>Enviar mensaje</Button>
          {feedback && (
            <p className="mt-2 text-sm text-slate-600">{feedback}</p>
          )}
        </div>
      )}
      <div className="mb-6">
        <h2 className="font-semibold">Reportar publicación</h2>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input w-full mb-2"
        >
          <option value="">Selecciona motivo</option>
          <option value="spam">Spam</option>
          <option value="inapropiado">Contenido inapropiado</option>
          <option value="falsa">Falsa información</option>
        </select>
        <Input
          placeholder="Comentario (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleReport} className="mt-2">
          Enviar Reporte
        </Button>
      </div>
    </div>
  );
};
export default PropertyDetailPage;
