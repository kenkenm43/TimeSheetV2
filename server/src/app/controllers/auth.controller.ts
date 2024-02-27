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

const handleRegister: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
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

const handleLogin: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const user = req["user"] as UserType;

    if (typeof user === "object" && user.username) {
      getAuthToken(req, res, next);
    }
  } catch (error) {
    return res.status(401).json({ message: "login fail", error });
  }
};

const handleLogout: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).json({ message: "No content" });
  const refreshToken = cookies.jwt;
  const foundUser = await prisma.user.findFirst({
    where: { refreshToken: refreshToken },
  });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.status(204).json({ message: "Clear cookie" });
  }
  await prisma.user.update({
    where: { username: foundUser.username },
    data: { refreshToken: "" },
  });

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  return res.status(200).json({ message: "Logout success" });
};

export default {
  handleLogin,
  handleRegister,
  handleLogout,
};
