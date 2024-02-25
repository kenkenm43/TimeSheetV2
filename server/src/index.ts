import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { timestampLoggerMiddleware } from "./app/middlewares/logging";
// const router = express.Router();
dotenv.config();

import { PrismaClient } from "@prisma/client";
import routes from "./app/routes/index";

import bodyParser from "body-parser";
const prisma = new PrismaClient();

const app = express();

const PORT = process.env.PORT || 7000;

async function main() {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(timestampLoggerMiddleware);
  app.use(routes);
  app.get("/", (req, res) => {
    res.send("Working");
  });
  //Catch unregistered routes
  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

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
    await prisma.$disconnect();
    process.exit(1);
  });
