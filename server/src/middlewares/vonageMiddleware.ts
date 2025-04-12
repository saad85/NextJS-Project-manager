import { Request, Response, NextFunction } from "express";
import { verifyVonageJWT } from "../utils/vonageSignature";

export const handleInboundMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValid = verifyVonageJWT(req.headers);

  console.log("isValid", isValid);

  if (!isValid) {
    return res.status(401).json({ error: "Unauthorized: Invalid Signature" });
  }

  next();
};
