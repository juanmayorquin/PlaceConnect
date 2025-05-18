import { Request, Response } from 'express';
import Message from '../models/Message';
import Notification from '../models/Notification';

// POST /api/messages
export const sendMessage = async (req: Request, res: Response) => {
  const senderId = (req as any).userId;
  const { receiverId, propertyId, content } = req.body;
  const msg = await Message.create({ senderId, receiverId, propertyId, content });
  // Crear notificación para receiver
  await Notification.create({ userId: receiverId, messageId: msg._id });
  res.status(201).json(msg);
};

// GET /api/messages/conversations
export const getConversations = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  // listar interlocutores únicos
  const conv = await Message.aggregate([
    { $match: { $or: [ { senderId: userId }, { receiverId: userId } ] } },
    { $project: { other: { $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId'] } } },
    { $group: { _id: '$other' } }
  ]);
  res.json(conv.map(c => c._id));
};

// GET /api/messages/:otherId
export const getMessages = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { otherId } = req.params;
  const msgs = await Message.find({
    $or: [
      { senderId: userId, receiverId: otherId },
      { senderId: otherId, receiverId: userId }
    ]
  }).sort('createdAt');
  res.json(msgs);
};