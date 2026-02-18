import prisma from "@/lib/prisma";
import { formatBDPhoneNumber, isRateLimited, validateBDPhoneNumber } from "@cofounder/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "local";
        const body = await req.json();
        const { customer, items, total, deliveryCharge } = body;

        if (isRateLimited(`bengolsale_checkout_ip_${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 })) {
            return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
        }

        if (!customer?.name || !customer?.phone || !customer?.address) {
            return NextResponse.json({ success: false, error: "Missing customer details" }, { status: 400 });
        }

        if (!validateBDPhoneNumber(customer.phone)) {
            return NextResponse.json({ success: false, error: "Invalid Bangladeshi phone number" }, { status: 400 });
        }

        const formattedPhone = formatBDPhoneNumber(customer.phone);

        if (isRateLimited(`bengolsale_checkout_phone_${formattedPhone}`, { limit: 2, windowMs: 60 * 60 * 1000 })) {
            return NextResponse.json({ success: false, error: "Too many orders for this phone number." }, { status: 429 });
        }
        const pendingOrders = await prisma.order.count({
            where: {
                brandId: "bengolsale",
                customerPhone: formattedPhone,
                status: "PENDING",
            },
        });

        if (pendingOrders >= 2) {
            return NextResponse.json({ success: false, error: "You have too many pending orders." }, { status: 400 });
        }

        const order = await prisma.order.create({
            data: {
                brandId: "bengolsale",
                customerName: customer.name,
                customerPhone: formattedPhone,
                customerAddress: customer.address,
                customerArea: customer.area || 'inside',

                total: total,
                deliveryCharge: deliveryCharge,
                status: "PENDING",

                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize,
                        selectedColor: item.selectedColor,
                        imageUrl: item.imageUrl,
                        metadata: item.metadata,
                    })),
                },
            },
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error: any) {
        console.error("Order creation failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const apiKey = req.headers.get("x-admin-key");
        const validKey = process.env.ADMIN_API_KEY;

        if (!validKey || apiKey !== validKey) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
