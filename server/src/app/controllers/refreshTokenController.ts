/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler, Response } from "express";
import prisma from "../../config/prisma";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../../utils/environment";
import { jwtGenerate } from "../../libs/jwt";
export const handleRefreshTokenV2: RequestHandler = async (
  req: any,
  res: Response
) => {
  const cookies = req.cookies;
  console.log(cookies.jwt);

  if (!cookies?.jwt)
    return res.status(401).send({ message: "Invalid refresh token" });
  const refreshToken = cookies.jwt;

  const foundUser: any = await prisma.system_Access.findFirst({
    where: { refreshToken: refreshToken },
  });

  if (!foundUser) return res.status(403).send({ message: "Not found user" });
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
    if (err || foundUser?.username !== decoded.username)
      return res.status(403).send("Token not same");

    const accessToken = jwtGenerate(decoded);
    res.status(200).send({ accessToken });
  });
};
