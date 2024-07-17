import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient({
  // log: ["query"],
});

export default prisma;
