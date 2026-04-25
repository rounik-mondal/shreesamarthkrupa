import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import CustomizerReviewClient from './CustomizerReviewClient';

export default async function CustomizerReviewPage({ params }) {
  const { id } = await params;

  const req = await prisma.customRequest.findUnique({
    where: { id }
  });

  if (!req) notFound();

  const serializedReq = {
    ...req,
    offeredPrice: req.offeredPrice ? Number(req.offeredPrice) : null
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-12 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif text-royal-900 mb-8">Customization Request</h1>
        <CustomizerReviewClient request={serializedReq} />
      </div>
    </main>
  );
}
