import { Request, Response } from "express";
import Property from "../models/Property";
import fs from "fs";
import path from "path";

// Crear
export const createProperty = async (req: Request, res: Response) => {
  const owner = (req as any).userId;
  const { title, description, price, type, keypoints, bathrooms, bedrooms, images, location, area } = req.body;
  // Validar que no exista otra propiedad con la misma localización
  const exists = await Property.findOne({ 'location.tower': location.tower, 'location.apartment': location.apartment });
  if (exists) {
    return res.status(400).json({ msg: 'Ya existe una propiedad con esa localización (torre y apartamento).' });
  }
  const prop = await Property.create({
    owner,
    title,
    description,
    price,
    type,
    keypoints,
    bathrooms,
    bedrooms,
    images,
    location,
    area,
    status: 'disponible',
  });
  res.status(201).json(prop);
};

// Listar mis avisos
export const listMyProperties = async (req: Request, res: Response) => {
  const owner = (req as any).userId;
  const props = await Property.find({ owner });
  res.json(props);
};

// Editar
export const updateProperty = async (req: Request, res: Response) => {
  const owner = (req as any).userId;
  const { id } = req.params;
  const prop = await Property.findOne({ _id: id, owner });
  if (!prop) {
    res.status(404).json({ msg: "Aviso no encontrado" });
    return;
  }
  const { title, description, price, type, keypoints, bathrooms, bedrooms, status, images, location, area } = req.body;
  // Validar que no exista otra propiedad con la misma localización (excluyendo la actual)
  const exists = await Property.findOne({
    'location.tower': location.tower,
    'location.apartment': location.apartment,
    _id: { $ne: id }
  });
  if (exists) {
    return res.status(400).json({ msg: 'Ya existe una propiedad con esa localización (torre y apartamento).' });
  }
  Object.assign(prop, { title, description, price, type, keypoints, bathrooms, bedrooms, status, images, location, area });
  await prop.save();
  res.json(prop);
};

// Eliminar
export const deleteProperty = async (req: Request, res: Response) => {
  const owner = (req as any).userId;
  const { id } = req.params;
  const prop = await Property.findOneAndDelete({ _id: id, owner });
  if (!prop) {
    res.status(404).json({ msg: "Aviso no encontrado" });
    return;
  }
  // borrar imágenes
  prop.images.forEach((url) => {
    const p = path.join(__dirname, "../../", url);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
  res.json({ msg: "Aviso eliminado" });
};

// Moderación (admin)
export const listPending = async (req: Request, res: Response) => {
  const props = await Property.find({
    /* aquí lógica: revisar estado o flag de revisión */
  });
  res.json(props);
};
export const moderateProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, reason } = req.body; // action='approve'|'reject'
  const prop = await Property.findById(id);
  if (!prop) {
    res.status(404).json({ msg: "Aviso no existe" });
    return;
  }
  prop.status = action === "approve" ? "disponible" : "inactivo";
  await prop.save();
  // notificar al owner (puedes usar sendEmail)
  res.json(prop);
};
