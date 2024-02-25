import { Request, Response } from "express";
import prisma from "../../config/prisma";
const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    console.log(user);

    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        idCard: user.idCard,
        password: user.password,
      },
    });
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
    });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default {
  getUsers,
  createUser,
};
