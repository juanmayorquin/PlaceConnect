import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendEmail } from "../utils/emailClient";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5000";

// Registro
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400).json({ msg: "Faltan campos" });
    return;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400).json({ msg: "Email ya registrado" });
    return;
  }

  // hashPassword middleware ya lo hizo
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const newUser = new User({ name, email, password, role, verifyToken });
  await newUser.save();

  const link = `${CLIENT_URL}/verify/${verifyToken}`;
  await sendEmail(
    email,
    "Verifica tu cuenta",
    `<a href="${link}">Haz clic para verificar</a>`
  );

  res
    .status(201)
    .json({ msg: "Usuario creado. Revisa tu correo para verificar." });
  return;
};

// 4.2 Verificación
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = await User.findOne({ verifyToken: token });
  if (!user) {
    res.status(400).json({ msg: "Token inválido o expirado" });
    return;
  }
  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();
  res.json({ msg: "Cuenta verificada" });
};

// 4.3 Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ msg: "Credenciales inválidas" });
    return;
  }
  if (!user.isVerified) {
    res.status(400).json({ msg: "Cuenta no verificada" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ msg: "Credenciales inválidas" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

// 4.4 Solicitar recuperación
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ msg: "Email no encontrado" });
    return;
  }

  user.resetToken = crypto.randomBytes(32).toString("hex");
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();

  const link = `${CLIENT_URL}/reset-password/${user.resetToken}`;
  await sendEmail(
    email,
    "Reestablece tu contraseña",
    `<a href="${link}">Restablece tu contraseña</a>`
  );

  res.json({ msg: "Revisa tu correo para restablecer tu contraseña" });
};

// 4.5 Resetear contraseña
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });
  if (!user) {
    res.status(400).json({ msg: "Token inválido o expirado" });
    return;
  }

  user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ msg: "Contraseña actualizada" });
};
