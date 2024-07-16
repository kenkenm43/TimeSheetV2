/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import prisma from "../../config/prisma";
import fs from "fs";
const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params["id"];
    const payload = req.body;
    console.log(employeeId);

    console.log(req.body);
    console.log("update");

    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        nickName: payload.nickName,
        idCard: payload.idCard,
        gender: payload.gender,
        address: payload.address,
        date_of_birth: payload.date_of_birth,
        phone_number: payload.phone_number,
        email: payload.email,
        Financial_Details: {
          update: {
            bank_account_number: payload.bank_account_number,
            bank_name: payload.bank_name,
            social_security_number: payload.social_security_number,
          },
        },
      },
      include: { Financial_Details: {}, Employment_Details: {} },
    });
    console.log(employee);

    return res.status(200).json(employee);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

const updateEmployeeStartWork = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params["id"];
    const payload = req.body;
    console.log(payload);

    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        Employment_Details: {
          update: {
            start_date: payload.start_date,
            salary: Number(payload.salary),
          },
        },
      },
      include: { Financial_Details: {}, Employment_Details: {} },
    });
    console.log(employee);

    return res.status(200).json(employee);
  } catch (e) {
    console.log(e);

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
    const { roleQuery } = req.query;
    console.log(req.query);

    console.log(roleQuery);

    console.log(roleQuery === "all" ? {} : { name: roleQuery });

    const employees = await prisma.employee.findMany({
      where: {
        System_Access: { role: { name: String(roleQuery) } },
      },
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
  updateEmployeeStartWork,
};
