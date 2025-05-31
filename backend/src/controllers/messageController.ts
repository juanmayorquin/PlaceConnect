import { Request, Response } from "express";
import Message from "../models/Message";
import Notification from "../models/Notification";
import User from "../models/User";
import { Types } from "mongoose";

// POST /api/messages
export const sendMessage = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.body.propertyId)) {
    res.status(400).json({ msg: "propertyId inválido" });
    return;
  }

  const senderId = (req as any).userId;
  const { receiverId, propertyId, content } = req.body;
  const msg = await Message.create({
    senderId,
    receiverId,
    propertyId,
    content,
  });
  // Crear notificación para receiver
  await Notification.create({ userId: receiverId, type: "message", messageId: msg._id });
  res.status(201).json(msg);
};

// GET /api/messages/conversations
export const getConversations = async (req: Request, res: Response) => {
  const userId = new Types.ObjectId((req as any).userId);

  // 1) Encuentra partners y propertyIds juntos
  const raw = await Message.aggregate([
    { $match: { $or: [{ senderId: userId }, { receiverId: userId }] } },
    {
      $project: {
        other: {
          $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
        },
        propertyId: "$propertyId",
        ts: "$createdAt",
      },
    },
    // ordena por fecha descendente para agrupar últimas
    { $sort: { ts: -1 } },
    // agrupa por (other, propertyId) tomando el primero (último mensaje)
    {
      $group: {
        _id: { other: "$other", propertyId: "$propertyId" },
        ts: { $first: "$ts" },
      },
    },
  ]);

  // 2) Extrae arrays de ids
  const combos = raw.map((r) => ({
    otherId: r._id.other,
    propertyId: r._id.propertyId,
  }));

  // 3) Busca datos de usuarios correspondientes
  const uniqueUserIds = [...new Set(combos.map((c) => c.otherId.toString()))];
  const users = await User.find({ _id: { $in: uniqueUserIds } })
    .select("name email")
    .lean();

  // 4) Construye la respuesta
  const result = combos.map(({ otherId, propertyId }) => {
    const u = users.find((u) => u._id.toString() === otherId.toString());
    return {
      otherId: otherId.toString(),
      propertyId: propertyId.toString(),
      name: u?.name,
      email: u?.email,
    };
  });

  res.json(result);
};

// GET /api/messages/:otherId/:propertyId
export const getMessages = async (req: Request, res: Response) => {
  const userId = new Types.ObjectId((req as any).userId);
  const otherId = new Types.ObjectId(req.params.otherId);

  const propertyId = new Types.ObjectId(req.params.propertyId);

  const msgs = await Message.find({
    propertyId, // <- filtra solo esta propiedad
    $or: [
      { senderId: userId, receiverId: otherId },
      { senderId: otherId, receiverId: userId },
    ],
  }).sort("createdAt");

  res.json(msgs);
};
