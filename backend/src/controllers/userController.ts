import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const user = await User.findById(userId).select('-password -verifyToken -resetToken');
  if (!user) {
    res.status(404).json({ msg: 'Usuario no encontrado' });
    return;
  }
  res.json(user);
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { name, email, password, profileImageUrl } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ msg: 'Usuario no encontrado' });
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
  res.json({ msg: 'Perfil actualizado', profileImageUrl: user.profileImageUrl });
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  await User.findByIdAndDelete(userId);
  res.json({ msg: 'Cuenta eliminada correctamente' });
};
