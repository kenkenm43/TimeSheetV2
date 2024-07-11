import express from "express";
import salaryController from "../controllers/salary.controller";
const router = express.Router();

router.get("/", salaryController.getSalaryById);
// router.get("/user", verifyAccessToken, UserController.getUser);
router.post("/", salaryController.addSalary);
router.put("/", salaryController.updateSalary);

export default router;
