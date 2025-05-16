import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ msg: "No autorizado" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    (req as any).userId = payload.userId;
    (req as any).userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ msg: "Token inválido" });
    return;
  }
};

/**
 * authorizeAdmin: revisa que el usuario autenticado tenga rol 'Admin'
 */
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = (req as any).userRole as string;
  if (role !== "Admin") {
    res.status(403).json({ msg: "Acceso restringido a administradores" });
    return;
  }
  next();
};
