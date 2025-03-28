import { Request, Response } from "express";
import { ZodError } from "zod";
import { signupService } from "@/services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await signupService(req.body);
    res
      .status(201)
      .json({ message: "User and Organization created successfully", user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((err) => err.message) });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
