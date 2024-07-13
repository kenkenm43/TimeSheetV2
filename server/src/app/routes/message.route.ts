import express from "express";
const router = express.Router();
import messageController from "../controllers/message.controller";
router.get("/:senderId/:receivedId", messageController.receiveMessage);
router.get("/:receivedId", messageController.employeeReceiveMessage);
router.post("/", messageController.sendMessage);
router.put("/", messageController.updateMessage);
router.delete("/:messageId", messageController.deleteMessage);

export default router;
