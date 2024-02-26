/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

import express from "express";
import UserRoute from "./../routes/users.route";
import AuthRoute from "./../routes/auth.route";
import createError from "http-errors";
const router = express.Router();

router.use("/api/v1/auth", AuthRoute);
// router.use("/api/v1/refresh");
router.use("/api/v1", UserRoute);

router.use(async (req, res, next) => {
  next(createError.NotFound("Route not Found"));
});
router.use((err: any, req: Request, res: Response) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message,
  });
});
export default router;
