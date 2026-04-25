import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import OrderDetailsClient from './OrderDetailsClient';

export default async function OrderDetailsPage({ params }) {
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) notFound();

  const serializedOrder = {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map(item => ({
      ...item,
      price: Number(item.price)
    }))
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-royal-900 mb-8">Manage Order #{order.id.slice(-6)}</h1>
      <OrderDetailsClient order={serializedOrder} />
    </div>
  );
}
