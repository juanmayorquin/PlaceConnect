import { Request, Response } from 'express';
import Notification from '../models/Notification';

// GET /api/notifications
export const getNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const notes = await Notification.find({ userId }).populate('messageId');
  res.json(notes);
};

// POST /api/notifications/:id/read
export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
  res.json(note);
};