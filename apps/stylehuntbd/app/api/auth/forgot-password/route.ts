import { emailService } from "@/lib/email.service";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists with this email, a reset link will be sent.",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000);
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    await emailService.sendPasswordResetEmail(email, resetLink);
    return NextResponse.json({
      message:
        "If an account exists with this email, a reset link will be sent.",
    });
  } catch (error) {
    console.error("Password Reset Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
