import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};
