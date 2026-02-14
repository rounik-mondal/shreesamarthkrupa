import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { userId } = auth();
    
    // Check if user is Admin in DB
    const user = await prisma.user.findUnique({ where: { id: userId }});
    if (!user || user.role !== 'ADMIN') {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Fetch all orders with details for the dashboard
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } }, // Get customer details
        items: { include: { product: true } }          // Get product details
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);

  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}