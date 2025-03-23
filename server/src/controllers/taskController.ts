import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.query.projectId as string;
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
      attachmentUrl,
    } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    if (attachmentUrl) {
      await prisma.attachment.create({
        data: {
          fileURL: attachmentUrl,
          taskId: task.id,
          uploadedById: authorUserId,
        },
      });
    }
    res.status(201).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });
    res.status(200).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating a task: ${error.message}` });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.query as { id: string };
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
    } = req.body;
    const task = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(200).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating a task: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ authorUserId: userId }, { assignedUserId: userId }],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting user tasks: ${error.message}` });
  }
};
