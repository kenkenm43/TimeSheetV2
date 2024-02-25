import express from "express";
import AuthController from "../controllers/auth.controller";
import { handleRefreshToken } from "../middlewares/authToken";
import { checkLogin, checkRegister } from "../middlewares/checkAuth";
const router = express.Router();

router.post("/register", checkRegister, AuthController.register);
router.post("/login", checkLogin, AuthController.login);
router.get("/refresh-token", handleRefreshToken);

export default router;
