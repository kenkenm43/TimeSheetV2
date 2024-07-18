/* eslint-disable @typescript-eslint/no-explicit-any */
import allowedOrigins from "../../config/allowedOrigins";

const credentials = (req: any, res: any, next: any) => {
  const origin = req.headers?.origin;
  if (allowedOrigins.includes(origin)) {
    res.header(
      "Access-Control-Allow-Credentials",
      "https://time-sheet-v2.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }
  next();
};

export = credentials;
