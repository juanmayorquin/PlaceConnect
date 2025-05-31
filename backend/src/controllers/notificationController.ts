import { Request, Response } from "express";
import Notification from "../models/Notification";

// GET /api/notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Populate: primero trae agreementId, luego propertyId dentro de Agreement
    const notes = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "agreementId",
        select: "propertyId",
        populate: { path: "propertyId", select: "title" },
      })
      .populate({ path: "messageId", select: "content" })
      .lean(); // lean() devuelve plain JS objects

    // Transformación rápida para enviar solo lo necesario
    const formatted = notes.map((n) => ({
      _id: n._id,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt,
      messageId: n.messageId
        ? { content: (n.messageId as any).content }
        : undefined,
      // agreementId viene con structure: { _id, propertyId: { _id, title } }
      agreementId: n.agreementId
        ? {
            _id: (n.agreementId as any)._id,
            propertyId: (n.agreementId as any).propertyId._id,
            propertyTitle: (n.agreementId as any).propertyId.title,
          }
        : undefined,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("Error en getNotifications:", err);
    return res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
};

// POST /api/notifications/:id/read
export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  res.json(note);
};
