import express from "express";
import UserController from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares/authToken";
import salaryController from "../controllers/salary.controller";
const router = express.Router();

router.get("/salary-all?month", verifyAccessToken, UserController.getUsers);
// router.get("/user", verifyAccessToken, UserController.getUser);
router.post("/salary", salaryController.addSalary);

export default router;
