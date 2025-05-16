import { Request, Response } from "express";
import Property from "../models/Property";

// GET /api/properties?type=&minPrice=&maxPrice=&status=
export const searchProperties = async (req: Request, res: Response) => {
  const { type, minPrice, maxPrice, status } = req.query;
  const filter: any = { status: status || "disponible" };
  if (type) filter.type = type;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  const props = await Property.find(filter);
  res.json(props);
};

// GET /api/properties/:id
export const getProperty = async (req: Request, res: Response) => {
  const prop = await Property.findById(req.params.id).populate("owner");
  if (!prop) {
    res.status(404).json({ msg: "No encontrado" });
    return;
  }
  res.json(prop);
};
