import { auth } from "@/auth";
import { uploadImage } from "@/lib/cloudinary";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import path from "path";
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(
      tempDir,
      `upload-${Date.now()}-${file.name}`,
    );
    fs.writeFileSync(tempFilePath, buffer);
    const result = await uploadImage(tempFilePath, "ZestWear/Avatars");
    if (!result || !result.secure_url) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
