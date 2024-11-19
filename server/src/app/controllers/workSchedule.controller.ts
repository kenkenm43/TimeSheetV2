/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from "express";
import prisma from "../../config/prisma";

import { getAuthToken } from "../middlewares/authToken";
import { ErrorHandler, handleError } from "../../utils/error";
import moment from "moment-timezone";
const workSchedule: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const employeeId = req.params["id"];
    const payload = req.body;
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const { currentStart, currentEnd } = req.body;

    const workSchedule = await prisma.workSchedule.findMany({
      where: {
        employeeId: employeeId,
        work_start: {
          gte: new Date(currentStart || firstDay),
          lte: new Date(currentEnd || lastDay),
        },
        work_end: {
          gte: new Date(currentStart || firstDay),
          lte: new Date(currentEnd || lastDay),
        },
      },
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
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const { currentStart, currentEnd } = req.body;

    const leaveSchedule = await prisma.leave.findMany({
      where: {
        employeeId: employeeId,
        leave_date: {
          gte: new Date(currentStart || firstDay),
          lte: new Date(currentEnd || lastDay),
        },
      },
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
        work_start: moment.utc(payload.work_start).tz("Asia/Bangkok").format(),
        work_end: moment.utc(payload.work_end).tz("Asia/Bangkok").format(),
        work_status: payload.work_status,
        work_ot: payload.work_ot,
        work_perdium: payload.work_perdium,
        work_reason: payload.work_reason,
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
    const dateId = req.params["dateId"];
    const payload = req.body;
    const update = await prisma.workSchedule.update({
      where: { id: dateId, employeeId: employeeId },
      data: {
        work_start: payload.work_start,
        work_end: payload.work_end,
        work_status: payload.work_status,
        work_ot: payload.work_ot,
        work_perdium: payload.work_perdium,
        work_reason: payload.work_reason,
      },
    });
    return res
      .status(200)
      .json({ ...update, message: "เปลี่ยนข้อมูลเรียบร้อย" });
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
        leave_reason: payload.leave_reason || "",
        leave_type: payload.leave_type || "",
        leave_cause: payload.leave_cause || "",
      },
    });
    return res.status(200).json({ ...newLeave, message: "บันทึกเรียบร้อย" });
  } catch (error) {
    return handleError(error, res);
  }
};
const deleteLeaveSchedule: RequestHandler = async (req: any, res: Response) => {
  try {
    const employeeId = req.params["id"];
    const dateId = req.params["dateId"];

    await prisma.leave.delete({
      where: { id: dateId, employeeId: employeeId },
    });
    return res.status(200).json({ message: "ลบข้อมูลเรียบร้อย" });
  } catch (error) {
    return handleError(error, res);
  }
};
const updateLeaveSchedule: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const employeeId = req.params["id"];
    const dateId = req.params["dateId"];
    const payload = req.body;
    const update = await prisma.leave.update({
      where: { id: dateId, employeeId: employeeId },
      data: {
        leave_date: payload.leave_date,
        leave_reason: payload.leave_reason || "",
        leave_cause: payload.leave_cause || "",
        leave_type: payload.leave_type || "",
      },
    });
    return res
      .status(200)
      .json({ ...update, message: "เปลี่ยนข้อมูลเรียบร้อย" });
  } catch (error) {
    return handleError(error, res);
  }
};

export default {
  workSchedule,
  leaveSchedule,
  addWorkSchedule,
  addLeaveSchedule,
  deleteWorkSchedule,
  deleteLeaveSchedule,
  updateWorkSchedule,
  updateLeaveSchedule,
};
