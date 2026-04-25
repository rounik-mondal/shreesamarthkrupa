import prisma from '@/lib/db';

export async function createNotification({ targetId, title, message, link = null }) {
  try {
    await prisma.notification.create({
      data: {
        targetId,
        title,
        message,
        link
      }
    });
  } catch (error) {
    console.error("Failed to create notification", error);
  }
}
