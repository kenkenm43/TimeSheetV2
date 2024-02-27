import express from "express";
import UserController from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares/authToken";
const router = express.Router();

router.get("/users", verifyAccessToken, UserController.getUsers);
// router.get("/user", verifyAccessToken, UserController.getUser);
router.post("/user", UserController.createUser);

router.route("/user").get(verifyAccessToken, UserController.getUser);

export default router;
