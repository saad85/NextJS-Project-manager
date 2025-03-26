import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!req.body.firstName) {
      return res.status(400).json({ message: "First name is required" });
    }
    if (!req.body.lastName) {
      return res.status(400).json({ message: "Last name is required" });
    }

    const {
      email,
      firstName,
      lastName,
      position,
      department,
      hireDate,
      phone,
      profilePictureUrl,
    } = req.body;
    const employee = await prisma.employee.create({
      data: {
        email,
        firstName,
        lastName,
        position,
        department,
        hireDate,
        phone,
        profilePictureUrl,
      },
    });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
