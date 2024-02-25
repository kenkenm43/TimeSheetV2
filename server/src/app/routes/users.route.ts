import express from "express";
import UserController from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares/authToken";
const router = express.Router();

router.get("/", verifyAccessToken, UserController.getUsers);
router.post("/", UserController.createUser);

export default router;
