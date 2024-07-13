/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../config/prisma";
import { Request, Response } from "express";
const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, receivedId, content, topic }: any = req.body;

    const message = await prisma.message.create({
      data: {
        topic: topic,
        content: content,
        sentById: senderId,
        receivedById: receivedId,
      },
    });
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const receiveMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.params["senderId"];
    const receivedId = req.params["receivedId"];

    console.log("senderId", senderId, "receive", receivedId);

    const messages = await prisma.message.findMany({
      where: {
        AND: [{ sentById: senderId }, { receivedById: receivedId }],
      },
    });

    return res.status(200).json(messages);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const employeeReceiveMessage = async (req: Request, res: Response) => {
  try {
    const receivedId = req.params["receivedId"];
    console.log("employeereceivedmessage", receivedId);

    const messages = await prisma.message.findMany({
      where: {
        receivedById: receivedId,
      },
      include: { receiver: {}, sender: {} },
      orderBy: { createdAt: "desc" },
    });
    console.log("message", messages);

    return res.status(200).json(messages);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const updateMessage = async (req: Request, res: Response) => {
  try {
    const { messageId, topic, content }: any = req.body;
    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        topic: topic,
        content: content,
      },
    });

    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
const deleteMessage = async (req: Request, res: Response) => {
  try {
    console.log("delete");
    const { messageId } = req.params;
    // const { messageId, id, employeeId }: any = req.body;

    console.log(req.body);

    const message = await prisma.message.delete({
      where: { id: messageId },
    });
    console.log(message);

    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default {
  sendMessage,
  receiveMessage,
  updateMessage,
  deleteMessage,
  employeeReceiveMessage,
};
