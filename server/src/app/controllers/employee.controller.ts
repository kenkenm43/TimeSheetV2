/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import prisma from "../../config/prisma";

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
};
