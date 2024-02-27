/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../utils/environment";
import jwt from "jsonwebtoken";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export const verifyToken: RequestHandler = async (req: any, res, next) => {
  const access_token: any = req.headers["authorization"];
  const refresh_token = req.cookies["refreshToken"];

  if (!access_token && !refresh_token) {
    return res.status(401).send("Access Denied. No token provided.");
  }
  try {
    const decoded: any = jwt.verify(access_token, ACCESS_TOKEN_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    if (!refresh_token) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }
    try {
      const decoded: any = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);
      const accessToken = jwt.sign(
        { user: decoded.user },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
      );

      res
        .cookie("refreshToken", REFRESH_TOKEN_SECRET, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", accessToken)
        .send(decoded.user);
    } catch (error) {
      return res.status(400).send("Invalid Token.");
    }
  }
};

export const verifyRefreshToken: RequestHandler = async (
  req: any,
  res,
  next
) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "Access Denied. No refresh token provided." });
  try {
    const decoded: any = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ user: decoded.user }, REFRESH_TOKEN_SECRET, {
      expiresIn: "3m",
    });
    req.decoded = decoded.user;
    req.access_token = accessToken;
    next();
    // if (!req.headers["authorization"])
    //   return res.status(403).json({ message: "ไม่มีสิทธ์ใช้ระบบ" });
    // const token = req.headers["authorization"].replace("Bearer ", "");

    // jwt.verify(token, REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
    //   if (err) throw new Error(err);

    //   req.user = decoded;
    //   req.user.token = token;
    //   delete req.user.exp;
    //   delete req.user.iat;
    //   next();
    // });
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};

export const verifyRole: RequestHandler = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "ไม่มีสิทธ์ใช้ระบบ" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).json({ message: "ไม่มีสิทธ์ใช้ระบบ" });
  }
};
