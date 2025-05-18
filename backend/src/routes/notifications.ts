import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController";

const router = Router();
router.get("/", authenticate, getNotifications);
router.post("/:id/read", authenticate, markAsRead);

export default router;
