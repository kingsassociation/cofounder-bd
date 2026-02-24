import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { brandId: "abedinterior" },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
