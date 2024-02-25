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

const register: RequestHandler = async (req: any, res: Response, next: any) => {
  try {
    const payload = req.body as UserRegisterPayloadType;
    const passwordHash = bcrypt.hashSync(payload.password, 10);
    const newUser = await prisma.user.create({
      data: { ...payload, password: passwordHash },
    });
    if (!newUser) {
      return res.status(400).json({ message: "การกรอกข้อมูลไม่ถูกต้อง" });
    }
    req["user"] = newUser;
    getAuthToken(req, res, next);
  } catch (error) {
    return res.status(400).json({ message: "Register fail", error });
  }
};

const login: RequestHandler = async (req: any, res: Response, next: any) => {
  try {
    const user = req["user"] as UserType;
    if (typeof user === "object" && (user.username || user.idCard)) {
      getAuthToken(req, res, next);
    }
  } catch (error) {
    res.status(401).json({ message: "login fail", error });
  }
};

export default {
  login,
  register,
};
