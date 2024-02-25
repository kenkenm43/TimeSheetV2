/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { RequestHandler, Response } from "express";
import { UserType, DecodeRefreshToken } from "../../types/userTypes";
import { jwtGenerate, jwtRefreshTokenGenerate } from "../../libs/jwt";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../utils/environment";
import prisma from "../../config/prisma";
// export const verifyResetToken = async (token: string) => {
//   jwt.verify(token);
//   try {
//   } catch (error) {}
// };

export const getAuthToken: RequestHandler = async (req: any, res: Response) => {
  const user = req["user"] as UserType;
  const accessToken = jwtGenerate(user);
  const refreshToken = await jwtRefreshTokenGenerate(user);
  res.status(200).json({
    username: user?.username,
    accessToken,
    refreshToken,
    isLoggedIn: true,
  });
};

export const verifyAccessToken: RequestHandler = async (
  req: any,
  res: Response,
  next: any
) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "") || "";

  if (!token) return res.status(401).send({ message: "No token provided" });

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ username: decoded.username }] },
      });
      req["user"] = user;
      next();
    } catch (error) {
      return res.status(401).send({ message: "Invalid user", error });
    }
  });
};

export const handleRefreshToken: RequestHandler = async (
  req: any,
  res: Response
) => {
  const refresh_token = (req.headers["refresh_token"] as string) || "";

  if (!refresh_token) {
    return res.status(401).send({ message: "Invalid refresh token" });
  }
  try {
    const decodedRefreshToken = jwt.verify(
      refresh_token,
      REFRESH_TOKEN_SECRET
    ) as DecodeRefreshToken;
    if (!decodedRefreshToken) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ username: decodedRefreshToken.username }] },
    });

    if (user?.refreshToken !== refresh_token) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const accessToken = jwtGenerate(user);
    const refreshToken = await jwtRefreshTokenGenerate(user);

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(401).send({ message: error });
  }
};
