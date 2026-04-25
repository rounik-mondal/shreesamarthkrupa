import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const customReq = await prisma.customRequest.findUnique({ where: { id } });

    if (!customReq || !customReq.offeredPrice) {
      return NextResponse.json({ error: 'Invalid request or no offer made' }, { status: 400 });
    }

    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(Number(customReq.offeredPrice) * 100), // in paise
      currency: 'INR',
      receipt: `creq_${Date.now()}_${customReq.userId.slice(0, 5)}`
    });

    await prisma.customRequest.update({
      where: { id },
      data: {
        razorpayOrderId: rpOrder.id,
      }
    });

    return NextResponse.json({ razorpayOrderId: rpOrder.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}
