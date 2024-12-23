/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";
import bcrypt from "bcryptjs";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
} from "../../types/userTypes";
import { handleError, ErrorHandler } from "../../utils/error";
import { EmployeeType, SystemAccess } from "../../types/employeeTypes";

export const checkLogin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body as UserLoginPayloadType;

  // if (!payload.username || !payload.password) {
  //   throw new ErrorHandler(400, "โปรดใส่ข้อมูลให้ครบถ้วน");
  // }

  try {
    const isUserAlready = await prisma.system_Access.findFirst({
      where: {
        OR: [
          {
            username: { equals: payload.username },
          },
          {
            employee: { idCard: { equals: payload.username } },
          },
        ],
      },
      include: {
        role: true,
      },
    });

    if (isUserAlready) {
      const isPasswordCorrect = bcrypt.compareSync(
        payload.password,
        isUserAlready.password
      );
      if (isPasswordCorrect) {
        req["user"] = isUserAlready;
        return next();
      } else {
        throw new ErrorHandler(400, `รหัสผ่านไม่ถูกต้อง`);
      }
    } else {
      throw new ErrorHandler(400, "ไม่มีชื่อผู้ใช้อยู่ในระบบ");
    }
  } catch (error: any) {
    return handleError(error, res);
  }
};

export const checkRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body as UserRegisterPayloadType;
    if (
      !payload.username ||
      !payload.firstName ||
      !payload.lastName ||
      !payload.idCard ||
      !payload.password
    ) {
      throw new ErrorHandler(500, "โปรดใส่ข้อมูลให้ครบถ้วน");
    }
    const existingEmail = await prisma.employee.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (existingEmail) throw new ErrorHandler(400, "อีเมลนี้ถูกใช้ไปแล้ว");
    const existingIdCard = await prisma.employee.findFirst({
      where: {
        idCard: payload.idCard,
      },
    });
    if (existingIdCard)
      throw new ErrorHandler(400, "เลขบัตรประชาชนนี้ถูกใช้ไปแล้ว");

    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [
          { System_Access: { username: payload.username } },
          { idCard: payload.username },
        ],
      },
    });

    if (existingEmployee) {
      throw new ErrorHandler(400, "บัญชีผู้ใช้นี้มีอยู่ในระบบแล้ว");
    }
    return next();
  } catch (error) {
    return handleError(error, res);
  }
};
