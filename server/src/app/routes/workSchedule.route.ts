import express from "express";
import workScheduleController from "../controllers/workSchedule.controller";
const router = express.Router();

router.get("/work-schedule", workScheduleController.workSchedule);
router.get("/work-schedule/:id", workScheduleController.workSchedule);
router.patch(
  "/work-schedule/:id/:dateId",
  workScheduleController.updateWorkSchedule
);
// router.get("/user", verifyAccessToken, UserController.getUser);
router.post("/work-schedule/:id", workScheduleController.addWorkSchedule);
router.delete(
  "/work-schedule/:id/:dateId",
  workScheduleController.deleteWorkSchedule
);

router.get("/leave/:id", workScheduleController.leaveSchedule);
router.patch("/leave/:id/:dateId", workScheduleController.updateLeaveSchedule);
router.post("/leave/:id", workScheduleController.addLeaveSchedule);
router.delete("/leave/:id/:dateId", workScheduleController.deleteLeaveSchedule);

// router.post("/leave-schedule", workScheduleController.createUser);

// router
//   .route("/leave-schedule")
//   .get(verifyAccessToken, workScheduleController.getUser);

export default router;
