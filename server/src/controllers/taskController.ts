import { sendWhatsApp } from "../services/notification/notificationService";
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
        author: {
          include: {
            user: true,
          },
        },
        comments: true,
        attachments: true,
        taskAssignments: {
          include: {
            orgUser: {
              include: {
                user: true,
              },
            },
          },
        },
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
      assignedIds,
    } = req.body;

    if (!title || !authorUserId || !projectId || !assignedIds?.length) {
      throw new Error("Missing required fields");
    }

    const result = await prisma.$transaction(async (prisma) => {
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
        },
      });

      if (assignedIds?.length) {
        await prisma.taskAssignment.createMany({
          data: assignedIds.map((id: string) => ({
            orgUserId: id,
            taskId: task.id,
          })),
        });
      }

      if (attachmentUrl) {
        await prisma.attachment.create({
          data: {
            fileURL: attachmentUrl,
            taskId: task.id,
            uploadedById: authorUserId,
          },
        });
      }

      return task;
    });

    await sendWhatsApp(
      "8801601076098",
      `Task ${title} has been assigned to you`
    );

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error creating a task:", error);
    res.status(500).json({
      message: `Error creating a task: ${error.message}`,
    });
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
        OR: [{ authorUserId: userId }],
      },
      include: {
        author: true,
        comments: true,
        attachments: true,
        taskAssignments: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting user tasks: ${error.message}` });
  }
};
