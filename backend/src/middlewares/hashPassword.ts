import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.password) return next();
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  next();
};
