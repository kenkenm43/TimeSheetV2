import express from "express";
import workScheduleController from "../controllers/workSchedule.controller";
const router = express.Router();

router.get("/work-schedule", workScheduleController.workSchedule);
router.get("/work-schedule/:id", workScheduleController.workSchedule);
router.patch("/work-schedule/:id");
// router.get("/user", verifyAccessToken, UserController.getUser);
router.post("/work-schedule/:id", workScheduleController.addWorkSchedule);

router.get("/leave/:id", workScheduleController.leaveSchedule);
router.post("/leave/:id", workScheduleController.addLeaveSchedule);

// router.post("/leave-schedule", workScheduleController.createUser);

// router
//   .route("/leave-schedule")
//   .get(verifyAccessToken, workScheduleController.getUser);

export default router;
