import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful
      const updatedOrder = await db.order.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'CONFIRMED',
          razorpayPaymentId: razorpay_payment_id
        }
      });

      return NextResponse.json({ success: true, orderId: updatedOrder.id });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
