import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { productId, rating, comment } = await request.json();
    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 409 },
      );
    }
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating: Math.min(Math.max(rating, 1), 5),
        comment,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
