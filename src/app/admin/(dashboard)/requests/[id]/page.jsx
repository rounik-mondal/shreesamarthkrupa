import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import RequestDetailsClient from './RequestDetailsClient';

export default async function RequestDetailsPage({ params }) {
  const { id } = await params;

  const req = await prisma.customRequest.findUnique({
    where: { id }
  });

  if (!req) notFound();

  const serializedReq = {
    ...req,
    offeredPrice: req.offeredPrice ? Number(req.offeredPrice) : ''
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-royal-900 mb-8">Review Request #{req.id.slice(-6)}</h1>
      <RequestDetailsClient request={serializedReq} />
    </div>
  );
}
