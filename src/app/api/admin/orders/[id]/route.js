import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { status, trackingLink } = await req.json();

    const order = await prisma.order.update({
      where: { id },
      data: { status, trackingLink }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
