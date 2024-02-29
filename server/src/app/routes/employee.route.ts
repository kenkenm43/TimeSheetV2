import express from "express";
import employeeController from "../controllers/employee.controller";
const router = express.Router();

router.get("/", employeeController.getEmployees);

router.get("/:id", employeeController.getEmployee);

export default router;
