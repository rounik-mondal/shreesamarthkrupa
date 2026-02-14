import prisma from '@/lib/db';
import ProductConfigurator from '@/components/ProductConfigurator';
import { notFound } from 'next/navigation';

async function getProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });
  return product;
}

export default async function ProductPage({ params }) {
  const { id } = await params; // Await params (Next.js 15 fix)
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // FIX: Convert "Decimal" to "Number" so Next.js doesn't crash
  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice), 
    // Also convert Dates to strings just in case
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  return (
    <main className="min-h-screen bg-cream">
      <ProductConfigurator product={serializedProduct} />
    </main>
  );
}