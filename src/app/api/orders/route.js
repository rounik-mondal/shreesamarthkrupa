import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server'; // <--- THIS WAS MISSING
import db  from '@/lib/db';
import { checkUser } from '@/lib/checkUser';

// POST: Create a new Order
export async function POST(req) {
  try {
    const user = await checkUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items, shippingDetails } = body;

    if (!items || items.length === 0) {
      return new NextResponse("No items in checkout", { status: 400 });
    }

    // Calculate total price based on quantity
    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Create Razorpay Order
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${user.id.slice(0, 5)}`
    });

    // Create the Order and OrderItems in one transaction
    const order = await db.order.create({
      data: {
        userId: user.id,
        totalAmount: totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        razorpayOrderId: rpOrder.id,
        items: {
          create: items.map((item) => ({
            productId: item.productId || item.id || "unknown", // Ensure fallback if missing
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            selectedConfig: item.customization || null
          }))
        }
      }
    });

    return NextResponse.json({ ...order, razorpayOrderId: rpOrder.id });

  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// GET: Fetch User's Orders
export async function GET(req) {
  try {
    const user = await currentUser(); // Now this will work!

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await db.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}