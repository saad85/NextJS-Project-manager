import { Request, Response } from "express";

export const inboundService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("req", req);
    console.log("headers in inbound", req.headers);
    console.log("body in inbound", req.body);

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    console.log("authHeader", authHeader);

    const authHeaderBase64 = authHeader.split(" ")[1];

    console.log("authHeaderBase64", authHeaderBase64);

    const decodedAuthHeader = Buffer.from(
      authHeaderBase64,
      "base64"
    ).toString();
    console.log("decodedAuthHeader", decodedAuthHeader);

    const [username, password] = decodedAuthHeader.split(":");

    console.log("username", username, process.env.VONAGE_WEBHOOK_USERNAME);
    console.log("password", password, process.env.VONAGE_WEBHOOK_PASSWORD);
    if (
      username !== process.env.VONAGE_WEBHOOK_USERNAME ||
      password !== process.env.VONAGE_WEBHOOK_PASSWORD
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json({ message: "Message received" });
  } catch (error) {
    console.error("Error in inbound service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
