/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import { Request, RequestHandler, Response } from "express";
import prisma from "../../config/prisma";
import { jwtGenerate, jwtRefreshTokenGenerate } from "../../libs/jwt";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserType,
} from "../../types/userTypes";
import { getAuthToken } from "../middlewares/authToken";
import { ErrorHandler, handleError } from "../../utils/error";

const workSchedule: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const workSchedule = await prisma.workSchedule.findMany({});

    return res.status(200).json({
      workSchedule,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

const leaveSchedule: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const leaveSchedule = await prisma.leave.findMany({});
    return res.status(200).json({
      leaveSchedule,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

const addWorkSchedule: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const employeeId = req.params["id"];
    const payload = req.body;
    const newDate = await prisma.workSchedule.create({
      data: {
        employeeId: employeeId,
        work_date: payload.date,
        work_status: payload.work_status,
      },
    });

    // if (!newUser) {
    //   throw new ErrorHandler(400, "การกรอกข้อมูลไม่ถูกต้อง");
    // }
    // req["user"] = newUser.System_Access;
    getAuthToken(req, res, next);
  } catch (error) {
    return handleError(error, res);
  }
};
const addLeaveSchedule: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const payload = req.body;
    const passwordHash = bcrypt.hashSync(payload.password, 10);
    const newUser = await prisma.employee.create({
      include: {
        System_Access: true,
      },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        idCard: payload.idCard,
        gender: "male",
        System_Access: {
          create: {
            username: payload.username,
            password: passwordHash,
            access_rights: "edit",
          },
        },
      },
    });
    if (!newUser) {
      throw new ErrorHandler(400, "การกรอกข้อมูลไม่ถูกต้อง");
    }
    req["user"] = newUser.System_Access;
    getAuthToken(req, res, next);
  } catch (error) {
    return handleError(error, res);
  }
};

export default {
  workSchedule,
  leaveSchedule,
  addWorkSchedule,
  addLeaveSchedule,
};
