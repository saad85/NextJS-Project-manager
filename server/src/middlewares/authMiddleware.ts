import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust type according to your User model
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    console.log("Token:", token);
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // 2. Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      orgId: string;
      roleId: string;
      iat: number;
      exp: number;
    };

    console.log("Decoded:", decoded);

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
    });

    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!decoded.orgId) {
      return res
        .status(401)
        .json({ error: "Organization ID not found in token" });
    }

    const organization = await prisma.organizationUser.findUnique({
      where: { id: decoded.orgId, userId: user.userId },
    });

    console.log("Organization:", organization);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // 4. Attach user to request object
    req.user = user;

    // 5. Proceed to next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    return res.status(500).json({ error: "Authentication failed" });
  }
};
