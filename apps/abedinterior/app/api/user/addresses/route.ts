import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateAddress, validateBDPhoneNumber } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { label, name, phoneNumber, address, district, thana, isPrimary } =
      body;
    if (!name || !phoneNumber || !address || !district || !thana) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    if (!validateBDPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid Phone Number" },
        { status: 400 },
      );
    }
    if (!validateAddress(address)) {
      return NextResponse.json({ error: "Address too short" }, { status: 400 });
    }
    if (isPrimary) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isPrimary: true },
        data: { isPrimary: false },
      });
    }
    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        name,
        phoneNumber,
        address,
        district,
        thana,
        isPrimary: isPrimary || false,
      },
    });
    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
    const address = await prisma.address.findUnique({
      where: { id },
    });
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 },
      );
    }
    await prisma.address.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
