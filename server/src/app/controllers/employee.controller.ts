/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import prisma from "../../config/prisma";
import fs from "fs";
const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params["id"];
    const payload = req.body;
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        nickName: payload.nickName,
        idCard: payload.idCard,
        gender: payload.gender,
        date_of_birth: payload.date_of_birth,
        phone_number: payload.phone_number,
        email: payload.email,
      },
    });

    return res.status(200).json(employee);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const uploadImage = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params["id"];

    if (!req.file) {
      res.status(413).send(`File not uploaded!, Please 
                            attach jpeg file under 5 MB`);
      return;
    }

    fs.readdir("uploads/", (err, files) => {
      files.forEach((file) => {
        if (req.body.oldImage === file) {
          fs.unlink("uploads/" + req.body.oldImage, (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    });

    // console.log(req.body.oldImage);

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        photo: req.file.filename,
      },
    });
    // successfull completion
    res.status(201).send({
      message: "File uploaded successfully",
      fileUrl: req.file.filename,
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: { Employment_Details: true, Financial_Details: true },
    });

    return res.status(200).json(employees);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const getEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params["id"];

    const employees = await prisma.employee.findFirst({
      where: { id: employeeId },
      include: { Employment_Details: true, Financial_Details: true },
    });

    return res.status(200).json(employees);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default {
  getEmployees,
  getEmployee,
  updateEmployee,
  uploadImage,
};
