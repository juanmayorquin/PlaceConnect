import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization header:", authHeader); // <-- Debug
  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.log("No token found in header"); // <-- Debug
    res.status(401).json({ msg: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    (req as any).userId = decoded.userId;
    console.log("Token válido, userId:", decoded.userId); // <-- Debug
    next();
  } catch (err) {
    console.log("Token inválido:", err); // <-- Debug
    res.status(401).json({ msg: "Token inválido" });
  }
};
