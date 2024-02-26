/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  RESET_TOKEN_SECRET,
} from "../utils/environment";
import { UserType } from "../types/userTypes";
import prisma from "../config/prisma";

export const jwtGenerate = (user: UserType): string => {
  return jwt.sign(
    { name: user.username, isLoggedIn: true, id: user.id },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "30s", algorithm: "HS256" }
  );
};

export const jwtResetTokenGenerate = (user: UserType): string => {
  return jwt.sign({ name: user.username, id: user.id }, RESET_TOKEN_SECRET, {
    expiresIn: "10m",
    algorithm: "HS256",
  });
};

export const jwtRefreshTokenGenerate = async (user: UserType) => {
  const token = jwt.sign({ username: user.username }, REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
  user.refreshToken = token;
  await prisma.user.update({
    where: {
      username: user.username,
    },
    data: {
      refreshToken: token,
    },
  });

  return token;
};
