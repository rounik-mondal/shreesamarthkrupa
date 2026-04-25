import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkUser } from '@/lib/checkUser';
import { jwtVerify } from 'jose';

export async function GET(req) {
  try {
    let targetId = null;

    // Check if it's admin request
    const adminToken = req.cookies.get('admin_token')?.value;
    if (adminToken) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
        await jwtVerify(adminToken, secret);
        targetId = "ADMIN";
      } catch (e) {
        // Not admin
      }
    }

    // Check if it's user request
    if (!targetId) {
      const user = await checkUser();
      if (user) targetId = user.id;
    }

    if (!targetId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { targetId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id } = await req.json(); // Notification ID
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
