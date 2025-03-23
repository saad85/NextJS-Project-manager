import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    if (!teams) {
      res.status(404).json({ message: "No teams found" });
    }

    const formattedTeams = await Promise.all(
      teams.map(async (team) => {
        const result = {
          ...team,
          productOwnerUsername: "",
          projectManagerUsername: "",
        };
        if (team.productOwnerUserId) {
          const productOwner = await prisma.user.findUnique({
            where: { userId: team.productOwnerUserId! },
            select: { username: true },
          });
          result.productOwnerUsername = productOwner?.username!;
        }

        if (team.projectManagerUserId) {
          const projectManager = await prisma.user.findUnique({
            where: { userId: team.projectManagerUserId! },
            select: { username: true },
          });
          result.projectManagerUsername = projectManager?.username!;
        }

        return result;
      })
    );
    res.status(200).json(formattedTeams);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};
