import prisma from '@/lib/db';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProduct({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  // Ensure basePrice is passed as number for the form
  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice)
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-royal-900 mb-8">Edit Product</h1>
      <ProductForm initialData={serializedProduct} />
    </div>
  );
}
