import express from "express";
import employeeController from "../controllers/employee.controller";
const router = express.Router();
import upload from "../middlewares/uploadImage";
import { uploadImageCloud } from "../../utils/cloudinaryUtil";
import prisma from "../../config/prisma";
router.get("/", employeeController.getEmployees);
router.get("/:id", employeeController.getEmployee);
router.put("/:id", employeeController.updateEmployee);
router.put("/startWork/:id", employeeController.updateEmployeeStartWork);
router.post(
  "/uploadImage/:id",
  (req, res) => {
    upload(req, res, async (err) => {
      //handling errors from multer
      const employeeId = req.params["id"];
      if (err) {
        return res.json({ error: err.message });
      }

      try {
        const imageStream = req.file?.buffer;
        const imageName = new Date().getTime().toString();

        const uploadResult: any = await uploadImageCloud(
          imageStream,
          imageName
        );

        const uploadedUrl = uploadResult.url;
        await prisma.employee.update({
          where: { id: employeeId },
          data: {
            photo: uploadedUrl,
          },
        });

        return res.status(201).send({
          message: "File uploaded successfully",
          fileUrl: uploadedUrl,
        });
      } catch (error) {
        return res.json({ error: "Failed to upload" });
      }
    });
  },
  employeeController.uploadImage
);

export default router;
