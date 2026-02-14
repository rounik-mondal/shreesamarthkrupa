import prisma from '@/lib/db'; // Uses your existing "Safe" connection import
import { NextResponse } from 'next/server';

// 1. GET: Fetch Products for the Shop Page
export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true, // Only show items in stock
      },
      orderBy: {
        createdAt: 'desc', // Newest items first
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 2. POST: Create a new Product (Your existing code)
export async function POST(req) {
  try {
    const body = await req.json();

    // Validating that the "options" JSON is structured correctly would happen here
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        basePrice: body.basePrice,
        category: body.category,
        images: body.images, // Array of strings
        options: body.options // This passes the JSON object directly to Postgres
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}