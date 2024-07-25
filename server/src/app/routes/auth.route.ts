import express from "express";
import AuthController from "../controllers/auth.controller";
import { handleRefreshToken } from "../middlewares/authToken";
import { handleRefreshTokenV2 } from "../controllers/refreshTokenController";
import { checkLogin, checkRegister } from "../middlewares/checkAuth";
const router = express.Router();

router.post("/register", checkRegister, AuthController.handleRegister);
router.post("/login", checkLogin, AuthController.handleLogin);
router.get("/logout", AuthController.handleLogout);
router.get("/refresh-token", handleRefreshToken);
router.get("/refresh-tokenV2", handleRefreshTokenV2);
router.post("/forgot-password", AuthController.handleResetPassword);
router.post("/change-password", AuthController.handleChangePassword);

export default router;
