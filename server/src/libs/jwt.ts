/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  RESET_TOKEN_SECRET,
} from "../utils/environment";
import { UserType } from "../types/userTypes";
import prisma from "../config/prisma";
import { SystemAccess } from "../types/employeeTypes";

export const jwtGenerate = (user: any): string => {
  return jwt.sign(
    { username: user.username, isLoggedIn: true, id: user.access_id },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "10m", algorithm: "HS256" }
  );
};

export const jwtRefreshTokenGenerate = async (user: any) => {
  try {
    const token = jwt.sign({ username: user.username }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
      algorithm: "HS256",
    });
    await prisma.system_Access.update({
      where: { access_id: user.access_id, employeeId: user.employeeId },
      data: {
        refreshToken: token,
      },
    });

    return token;
  } catch (error) {
    console.log(error);
  }
};

export const jwtResetTokenGenerate = (user: UserType): string => {
  return jwt.sign(
    { username: user.username, id: user.id },
    RESET_TOKEN_SECRET,
    {
      expiresIn: "1d",
      algorithm: "HS256",
    }
  );
};
