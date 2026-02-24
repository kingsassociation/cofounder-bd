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
        customerPhone: formattedPhone,
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

    console.log(`Checkout Debug: User found/created: ${user.id}`);

    // Verify brand exists
    const brand = await prisma.brand.findUnique({
      where: { id: "stylehuntbd" }
    });

    if (!brand) {
      console.error("Checkout Error: Brand 'stylehuntbd' not found in database");
      return NextResponse.json(
        { error: "Configuration error: Brand not found. Please run seed." },
        { status: 500 }
      );
    }

    // Verify all products exist to prevent foreign key errors
    for (const item of items) {
      const pid = String(item.originalId || item.id);
      const dbProduct = await prisma.product.findUnique({
        where: { id: pid }
      });
      if (!dbProduct) {
        console.error(`Checkout Error: Product ID ${pid} not found in database for item ${item.name}`);
        return NextResponse.json(
          { error: `Product '${item.name}' (ID: ${pid}) is not available. Please clear your cart and add it again.` },
          { status: 400 }
        );
      }
    }

    const order = await prisma.order.create({
      data: {
        brandId: "stylehuntbd",
        userId: user.id,
        customerPhone: formattedPhone,
        customerName: fullName,
        customerAddress: address,
        customerArea: `${district}, ${thana}`,
        total,
        status: "PENDING",
        paymentMethod: "COD",
        shippingAddress: {
          ...shippingAddress,
          customerPhone: formattedPhone,
        },
        items: {
          create: items.map((item: any) => ({
            productId: item.originalId || item.id,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            imageUrl: item.imageUrl,
            name: item.name, // Added name for better tracking
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log(`Checkout Debug: Order created: ${order.id}`);

    for (const item of items) {
      try {
        await prisma.product.update({
          where: { id: String(item.originalId || item.id) },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      } catch (updateError) {
        console.error(`Failed to update quantity for product ${item.id}:`, updateError);
        // We continue even if update fails to not block the order
      }
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
  } catch (error: any) {
    console.error("Checkout error full details:", error);
    return NextResponse.json(
      { error: `Failed to create order: ${error.message || "Unknown error"}` },
      { status: 500 },
    );
  }
}
