import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkUser } from '@/lib/checkUser';
import { createNotification } from '@/lib/notifications';

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { details } = await req.json();

    const customReq = await prisma.customRequest.create({
      data: {
        userId: user.id,
        details,
        status: 'PENDING'
      }
    });

    // Notify Admin
    await createNotification({
      targetId: 'ADMIN',
      title: 'New Customization Request',
      message: `${user.name || 'A customer'} requested a new estimation.`,
      link: `/admin/requests/${customReq.id}`
    });

    return NextResponse.json(customReq);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
