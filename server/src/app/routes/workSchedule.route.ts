import express from "express";
import workScheduleController from "../controllers/workSchedule.controller";
import { verifyAccessToken } from "../middlewares/authToken";
const router = express.Router();

router.get("/work-schedule", workScheduleController.workSchedule);
// router.get("/user", verifyAccessToken, UserController.getUser);
router.post("/work-schedule", workScheduleController.addWorkSchedule);
// router.post("/leave-schedule", workScheduleController.createUser);

// router
//   .route("/leave-schedule")
//   .get(verifyAccessToken, workScheduleController.getUser);

export default router;
