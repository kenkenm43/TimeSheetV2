import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { timestampLoggerMiddleware } from "./app/middlewares/logging";
// const router = express.Router();

dotenv.config();

import { PrismaClient } from "@prisma/client";
import routes from "./app/routes/index";

import credentials from "./app/middlewares/credentials";
import corsOptions from "./config/corsOptions";
const prisma = new PrismaClient();

const app = express();

const PORT = process.env.PORT || 7000;

async function main() {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(credentials);
  app.use(
    "*",
    cors({
      origin: ["http://localhost:5173", "https://time-sheet-v2.vercel.app"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
      credentials: false, // Allow cookies to be sent
      optionsSuccessStatus: 204, // Response for successful OPTIONS requests
    })
  );
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(express.static("uploads"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(timestampLoggerMiddleware);
  app.use(routes);

  //Catch unregistered routes
  // app.all("*", (req: Request, res: Response) => {
  //   res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  // });

  app.listen(PORT, () => {
    console.log(` Server is listening on port ${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect Prisma client
  });

export default app;
