import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function POST(
  request: Request,
  { params }: { params: { context: string } }
) {
  try {
    console.log("Starting S3 Pre-Signed URL generation");
    const { filename, filetype } = await request.json();

    console.log("Received filename:", filename);
    console.log("Received filetype:", filetype);
    console.log("Bucket name:", process.env.AWS_S3_BUCKET_NAME);
    console.log("Access key:", process.env.AWS_ACCESS_KEY);
    console.log("Secret key:", process.env.AWS_SECRET_KEY);
    console.log("Region:", process.env.AWS_REGION);

    if (!filetype.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // const key = `${params.context}/${filename}`;

    console.log("Generating signed URL for:", filename);
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      ContentType: filetype,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    console.log("Generated signed URL:", url);
    return NextResponse.json({ url, key: filename });
  } catch (error) {
    console.error("S3 Pre-Signed URL Error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
