/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import prisma from "../../config/prisma";

const addSalary = async (req: Request, res: Response) => {
  try {
    const { month, year, employeeId, salary, ot, perdiem } = req.body;
    const users = await prisma.salary.create({
      data: {
        employeeId: employeeId,
        month: month,
        year: year,
        amount: salary,
        ot: ot,
        perdiem,
      },
    });
    console.log(users);

    return res.status(201).json(users);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const getSalaryById = async (req: Request, res: Response) => {
  try {
    console.log(req.query);

    const empId = String(req.query.empId);
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    let salary;
    if (empId === "all") {
      console.log("all");

      salary = await prisma.salary.findMany({
        where: { year: year, month: month },
        include: {
          employee: {
            select: { firstName: true, lastName: true, nickName: true },
          },
        },
      });
      console.log("salary: ", salary);
    } else {
      console.log("w");
      salary = await prisma.salary.findFirst({
        where: {
          employeeId: empId,
          year: year,
          month: month,
        },
      });
    }

    console.log("salary: ", salary);

    return res.status(200).json(salary);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

const updateSalary = async (req: Request, res: Response) => {
  try {
    const { id, salary, ot, perdiem, employeeId } = req.body;
    console.log("update", req.body);
    const sly = await prisma.salary.update({
      where: {
        id: id,
        employeeId: employeeId,
      },
      data: {
        amount: Number(salary),
        ot: Number(ot),
        perdiem: Number(perdiem),
      },
    });
    console.log(sly);

    return res.status(201).json(sly);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default {
  addSalary,
  getSalaryById,
  updateSalary,
};
