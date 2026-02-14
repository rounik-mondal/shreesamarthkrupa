'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  // Safe Fallback if data is missing
  if (!product) return null;

  // DATA MAPPING: Handle Database fields vs Component fields
  // 1. Image: DB has 'images[]', Card needs single 'image'
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder.jpg'; // Ensure you have a placeholder in public/

  // 2. Price: DB 'basePrice' might be a string/decimal, convert to Number
  const price = Number(product.basePrice) || 0;

  return (
    <Link href={`/shop/${product.id}`} className="group relative block w-full cursor-pointer">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="h-full"
      >
        {/* Image Container with Zoom Effect */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-sm">
          <Image 
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
          
          {/* 'Quick Add' Overlay - Appears on Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <button className="w-full bg-royal-900 py-3 text-sm font-medium uppercase tracking-widest text-white hover:bg-royal-800">
              Customize This
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-4 flex flex-col items-start gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            {product.category}
          </span>
          <h3 className="font-serif text-xl text-royal-900 group-hover:underline decoration-gold-400 underline-offset-4">
            {product.name}
          </h3>
          <p className="font-sans text-sm text-gray-600">
            From ₹{price.toLocaleString('en-IN')}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}