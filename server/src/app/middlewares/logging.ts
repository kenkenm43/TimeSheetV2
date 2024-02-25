import { Request, Response, NextFunction } from "express";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`Incoming request to ${req.method} ${req.path} from ${req.ip}`);

  next();
};

export const timestampLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const now = new Date();
  console.log(
    `[${now.toISOString()}] Incoming request to ${req.method} ${req.path}`
  );

  next(); // Pass control to the next middleware
};
