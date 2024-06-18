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
    const employeeId = req.params["id"];
    const workSchedule = await prisma.workSchedule.findMany({
      where: { employeeId: employeeId },
    });

    return res.status(200).json([...workSchedule]);
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
    const employeeId = req.params["id"];

    const leaveSchedule = await prisma.leave.findMany({
      where: { employeeId: employeeId },
    });

    return res.status(200).json([...leaveSchedule]);
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
        work_start: payload.work_start,
        work_end: payload.work_end,
        work_status: payload.work_status,
      },
    });
    return res.status(200).json({ ...newDate, message: "บันทึกเรียบร้อย" });
  } catch (error) {
    return handleError(error, res);
  }
};
const updateWorkSchedule: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const employeeId = req.params["id"];
    const payload = req.body;
    // const newDate = await prisma.workSchedule.update({
    //   data: {
    //     employeeId: employeeId,
    //     work_start: payload.work_start,
    //     work_end: payload.work_end,
    //     work_status: payload.work_status,
    //   },
    // });
    // return res.status(200).json({ ...newDate, message: "บันทึกเรียบร้อย" });
  } catch (error) {
    return handleError(error, res);
  }
};
const deleteWorkSchedule: RequestHandler = async (req: any, res: Response) => {
  try {
    const employeeId = req.params["id"];
    const dateId = req.params["dateId"];
    await prisma.workSchedule.delete({
      where: { id: dateId, employeeId: employeeId },
    });
    return res.status(200).json({ message: "ลบข้อมูลเรียบร้อย" });
  } catch (error) {
    return handleError(error, res);
  }
};
const deleteLeaveSchedule: RequestHandler = async (req: any, res: Response) => {
  try {
    const employeeId = req.params["id"];
    const dateId = req.params["dateId"];
    await prisma.workSchedule.delete({
      where: { id: dateId, employeeId: employeeId },
    });
    return res.status(200).json({ message: "ลบข้อมูลเรียบร้อย" });
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
    const employeeId = req.params["id"];

    const payload = req.body;

    const newLeave = await prisma.leave.create({
      data: {
        employeeId: employeeId,
        leave_date: payload.leave_date,
        leave_reason: payload.leave_reason,
        leave_type: payload.leave_type,
      },
    });
    return res.status(200).json({ ...newLeave, message: "บันทึกเรียบร้อย" });
  } catch (error) {
    return handleError(error, res);
  }
};

export default {
  workSchedule,
  leaveSchedule,
  addWorkSchedule,
  deleteWorkSchedule,
  deleteLeaveSchedule,
  addLeaveSchedule,
  updateWorkSchedule,
};
