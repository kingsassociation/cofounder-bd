import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatBDPhoneNumber, validateBDPhoneNumber } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { phoneNumber, name, imageUrl } = body;
    let formattedPhone = undefined;
    if (phoneNumber) {
      if (!validateBDPhoneNumber(phoneNumber)) {
        return NextResponse.json(
          { error: "Invalid Bangladeshi phone number" },
          { status: 400 },
        );
      }
      formattedPhone = formatBDPhoneNumber(phoneNumber);
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (formattedPhone && formattedPhone !== user.phoneNumber) {
      const existing = await prisma.user.findUnique({
        where: { phoneNumber: formattedPhone },
      });
      if (existing) {
        if (existing.isGuest) {
          return NextResponse.json(
            {
              error:
                "This phone number is already used by another Guest account. Please place an order to claim it.",
            },
            { status: 409 },
          );
        }
        return NextResponse.json(
          { error: "This phone number is already in use." },
          { status: 409 },
        );
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        phoneNumber: formattedPhone || user.phoneNumber,
        imageUrl: imageUrl || user.imageUrl,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
