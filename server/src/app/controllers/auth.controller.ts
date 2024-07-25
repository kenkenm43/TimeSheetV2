/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import prisma from "../../config/prisma";
import { jwtGenerate, jwtRefreshTokenGenerate } from "../../libs/jwt";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
  UserType,
} from "../../types/userTypes";
import { sendEmail } from "../../libs/nodeMailer";
import { getAuthToken } from "../middlewares/authToken";
import { ErrorHandler, handleError } from "../../utils/error";

const handleRegister: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const payload = req.body as UserRegisterPayloadType;
    const passwordHash = bcrypt.hashSync(payload.password, 10);
    console.log(payload);

    const newUser = await prisma.employee.create({
      include: {
        System_Access: { include: { role: true } },
      },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        idCard: payload.idCard,
        gender: "",
        System_Access: {
          create: {
            username: payload.username,
            password: passwordHash,
          },
        },
        Employment_Details: {
          create: {
            position: "general",
          },
        },
        Financial_Details: {
          create: {},
        },
        Performance: {
          create: {},
        },
      },
    });
    console.log("newUser", newUser);

    if (!newUser) {
      throw new ErrorHandler(400, "การกรอกข้อมูลไม่ถูกต้อง");
    }
    req["user"] = newUser.System_Access;
    getAuthToken(req, res, next);
  } catch (error) {
    return handleError(error, res);
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
const handleResetPassword: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    sendEmail(req.body)
      .then((response: any) => res.send(response.message))
      .catch((error: any) => res.status(500).send(error.message));
  } catch (error) {
    return res.status(401).json({ message: "reset password fail", error });
  }
};

const handleChangePassword: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  try {
    const { email, password } = req.body;

    const passwordHash = bcrypt.hashSync(password, 10);
    const getEmail = await prisma.employee.findFirst({
      where: { email: email },
    });
    const changePassword = await prisma.system_Access.update({
      where: { employeeId: getEmail?.id },
      data: { password: passwordHash },
    });

    return res.status(204).json({ message: "update password success" });
  } catch (error) {
    return res.status(401).json({ message: "reset password fail", error });
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
  const foundUser = await prisma.system_Access.findFirst({
    where: { refreshToken: refreshToken },
  });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.status(204).json({ message: "Clear cookie" });
  }
  console.log(foundUser);

  await prisma.system_Access.update({
    where: { access_id: foundUser.access_id },
    data: { refreshToken: "" },
  });

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  return res.status(200).json({ message: "Logout success" });
};

export default {
  handleLogin,
  handleRegister,
  handleLogout,
  handleResetPassword,
  handleChangePassword,
};
