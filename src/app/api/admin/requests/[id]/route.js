import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { offeredPrice, adminNote, status, trackingLink } = await req.json();

    const previousReq = await prisma.customRequest.findUnique({ where: { id } });

    const updatedReq = await prisma.customRequest.update({
      where: { id },
      data: { offeredPrice, adminNote, status, trackingLink }
    });

    // Notify User if an offer was made
    if (status === 'OFFER_MADE' && previousReq.status !== 'OFFER_MADE') {
      await createNotification({
        targetId: updatedReq.userId,
        title: 'Offer Received',
        message: `An offer of ₹${offeredPrice} has been made for your custom request.`,
        link: `/customizer/${updatedReq.id}`
      });
    }

    // Notify User if shipped
    if (status === 'SHIPPED' && previousReq.status !== 'SHIPPED') {
      await createNotification({
        targetId: updatedReq.userId,
        title: 'Custom Order Shipped',
        message: `Your bespoke order has been shipped.`,
        link: `/customizer/${updatedReq.id}` // They can check tracking there
      });
    }

    return NextResponse.json(updatedReq);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
