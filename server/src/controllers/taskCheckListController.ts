import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTaskChecklist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;
    const task = await prisma.taskChecklist.create({
      data: {
        title,
        orgId: req.user.orgId,
        task: {
          connect: { id: taskId },
        },
        completed: false,
        createdAt: new Date(),
        createdBy: req.user.id,
      },
    });
    console.log("checking for created task check List ", task);
    res.status(201).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task checklist: ${error.message}` });
  }
};
