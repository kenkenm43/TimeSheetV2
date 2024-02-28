/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import prisma from "../../config/prisma";
const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;

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

    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

const getUser = async (req: any, res: Response) => {
  try {
    const idUser = req.params["id"];
    console.log(idUser);

    const user = await prisma.user.findFirst({
      where: { username: "kenkenm43" },
      select: {
        username: true,
        firstName: true,
        lastName: true,
        idCard: true,
      },
    });

    // const users = await prisma.user.findMany({
    //   include: { role: true },
    // });
    return res.status(200).json(user);
    // res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default {
  getUsers,
  createUser,
  getUser,
};
