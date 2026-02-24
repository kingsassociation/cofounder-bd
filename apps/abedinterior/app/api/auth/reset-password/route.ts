import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password" },
        { status: 400 },
      );
    }
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!existingToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }
    if (new Date() > existingToken.expires) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });
    await prisma.passwordResetToken.delete({
      where: { token },
    });
    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
