import express from "express";
const router = express.Router();
import messageController from "../controllers/message.controller";
router.get("/", messageController.receiveMessage);
router.post("/", messageController.sendMessage);
router.put("/", messageController.updateMessage);
router.delete("/", messageController.deleteMessage);

export default router;
