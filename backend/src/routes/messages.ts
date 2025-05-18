import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  sendMessage,
  getConversations,
  getMessages,
} from "../controllers/messageController";

const router = Router();
router.post("/", authenticate, sendMessage);
router.get("/conversations", authenticate, getConversations);
router.get("/:otherId", authenticate, getMessages);

export default router;
