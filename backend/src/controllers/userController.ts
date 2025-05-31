import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import Property from "../models/Property";
import Message from "../models/Message";
import Notification from "../models/Notification";
import Report from "../models/Report";
import mongoose from "mongoose";

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).userId;
  const user = await User.findById(userId).select(
    "-password -verifyToken -resetToken"
  );
  if (!user) {
    res.status(404).json({ msg: "Usuario no encontrado" });
    return;
  }
  res.json(user);
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).userId;
  const { name, email, password, profileImageUrl } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ msg: "Usuario no encontrado" });
    return;
  }
  user.name = name || user.name;
  user.email = email || user.email;
  if (profileImageUrl) user.profileImageUrl = profileImageUrl;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  await user.save();
  res.json({
    msg: "Perfil actualizado",
    profileImageUrl: user.profileImageUrl,
  });
};

export const deleteProfile = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    // 1) Borra todas las propiedades (y recoge sus IDs para los reportes)
    const props = await Property.find({ owner: userId });
    const propIds = props.map(p => p._id);
    await Property.deleteMany({ owner: userId });

    // 2) Borra mensajes donde participó
    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    // 3) Borra notificaciones dirigidas a él
    await Notification.deleteMany({ userId });

    // 4) Borra reportes que hizo
    await Report.deleteMany({ reporterId: userId });

    // 5) Borra reportes sobre sus propiedades
    if (propIds.length > 0) {
      await Report.deleteMany({ propertyId: { $in: propIds } });
    }

    // 6) Borra el propio usuario
    await User.findByIdAndDelete(userId);

    return res.json({ msg: 'Cuenta y datos relacionados eliminados' });
  } catch (err) {
    console.error('Error al eliminar cuenta:', err);
    return res.status(500).json({ msg: 'Error al eliminar cuenta' });
  }
};