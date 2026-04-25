import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        category: data.category,
        inStock: data.inStock,
        images: data.images,
        options: data.options,
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
