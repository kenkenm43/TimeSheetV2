/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import prisma from "../../config/prisma";

const addSalary = async (req: Request, res: Response) => {
  try {
    const { month, year, employeId, salary, ot, perdiem } = req.body;
    const users = await prisma.salary.create({
      data: {
        employeeId: employeId,
        month: month,
        year: year,
        amount: salary,
        ot: ot,
        perdiem,
      },
    });

    return res.status(201).json(users);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default {
  addSalary,
};
