import { auth } from "@/auth";
import { emailService } from "@/lib/email.service";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { findOrCreateUserByPhone } from "@/lib/user";
import {
  formatBDPhoneNumber,
  validateAddress,
  validateBDPhoneNumber,
} from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { items, shippingAddress, total } = await request.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const { phoneNumber, fullName, address, district, thana, email } =
      shippingAddress;
    if (!phoneNumber || !validateBDPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid Bangladeshi phone number" },
        { status: 400 },
      );
    }
    if (!validateAddress(address)) {
      return NextResponse.json(
        { error: "Please provide a more detailed address" },
        { status: 400 },
      );
    }
    const formattedPhone = formatBDPhoneNumber(phoneNumber);
    const ip = request.headers.get("x-forwarded-for") || "local";
    console.log(
      `Checkout Debug: Phone=${phoneNumber}, Formatted=${formattedPhone}, IP=${ip}`,
    );
    const ipLimitKey = `checkout_ip_${ip}`;
    const phoneLimitKey = `checkout_phone_${formattedPhone}`;
    if (isRateLimited(ipLimitKey, { limit: 50, windowMs: 15 * 60 * 1000 })) {
      console.log(`Rate Limit Hit: IP ${ip}`);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
    if (
      isRateLimited(phoneLimitKey, { limit: 200, windowMs: 60 * 60 * 1000 })
    ) {
      console.log(`Rate Limit Hit: Phone ${formattedPhone}`);
      return NextResponse.json(
        {
          error:
            "Too many orders for this phone number. Please try again later.",
        },
        { status: 429 },
      );
    }
    const MIN_ORDER_VALUE = 0;
    if (total < MIN_ORDER_VALUE) {
      return NextResponse.json(
        {
          error: `Minimum order value for Cash on Delivery is ${MIN_ORDER_VALUE} BDT`,
        },
        { status: 400 },
      );
    }
    const pendingOrders = await prisma.order.count({
      where: {
        phoneNumber: formattedPhone,
        status: "PENDING",
      },
    });
    if (pendingOrders >= 20) {
      return NextResponse.json(
        {
          error:
            "You have too many pending orders. Please wait for them to be processed.",
        },
        { status: 400 },
      );
    }
    const user = await findOrCreateUserByPhone({
      phoneNumber: formattedPhone,
      name: fullName,
      userId,
      email,
    });
    const order = await prisma.order.create({
      data: {
        brandId: "tuhinscollections",
        userId: user.id,
        phoneNumber: formattedPhone,
        total,
        status: "PENDING",
        paymentMethod: "COD",
        shippingAddress: {
          ...shippingAddress,
          phoneNumber: formattedPhone,
        },
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            imageUrl: item.imageUrl,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    for (const item of items) {
      await prisma.product.update({
        where: { id: String(item.id) },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }
    if (user.email || email) {
      try {
        await emailService.sendOrderCompletedEmail(
          (user.email || email) as string,
          user.name || fullName || "Valued Customer",
          {
            orderId: order.id,
            totalPrice: order.total,
            status: order.status,
            itemsCount: order.items.length,
          },
        );
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }
    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
