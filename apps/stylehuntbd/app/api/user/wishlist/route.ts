import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const checkProductId = searchParams.get("checkId");
    if (checkProductId) {
      const item = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: checkProductId,
          },
        },
      });
      return NextResponse.json({ inWishlist: !!item });
    }
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            quantity: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Wishlist GET error:", error);
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
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 },
      );
    }
    const userId = session.user.id;
    const pId = productId;
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: pId,
        },
      },
    });
    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({
        inWishlist: false,
        message: "Removed from wishlist",
      });
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId,
          productId: pId,
        },
      });
      return NextResponse.json({
        inWishlist: true,
        message: "Added to wishlist",
      });
    }
  } catch (error) {
    console.error("Wishlist Toggle error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
