import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { createNotification } from '@/lib/notifications';

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
      const updatedReq = await prisma.customRequest.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'PAID',
          razorpayPaymentId: razorpay_payment_id
        }
      });

      // Notify Admin
      await createNotification({
        targetId: 'ADMIN',
        title: 'Custom Order Paid',
        message: `Custom request #${updatedReq.id.slice(-6)} has been paid.`,
        link: `/admin/requests/${updatedReq.id}`
      });

      return NextResponse.json({ success: true, requestId: updatedReq.id });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
