import express from "express";
import employeeController from "../controllers/employee.controller";
const router = express.Router();
import upload from "../middlewares/uploadImage";
router.get("/", employeeController.getEmployees);
router.get("/:id", employeeController.getEmployee);
router.put("/:id", employeeController.updateEmployee);
router.put("/startWork/:id", employeeController.updateEmployeeStartWork);
router.post(
  "/uploadImage/:id",
  upload.single("file"),
  employeeController.uploadImage
);

export default router;
