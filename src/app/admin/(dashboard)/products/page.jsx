import prisma from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit } from 'lucide-react';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-royal-900">Products</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-royal-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-royal-800 transition-colors"
        >
          <Plus size={20} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Base Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="relative h-12 w-12 rounded bg-gray-100 overflow-hidden">
                    {product.images?.[0] && (
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill 
                        className="object-cover" 
                        unoptimized={product.images[0].startsWith('http')} 
                      />
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="p-4 text-sm text-gray-600">{product.category}</td>
                <td className="p-4 text-sm font-medium text-gray-900">₹{Number(product.basePrice).toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-4">
                  <Link 
                    href={`/admin/products/${product.id}`}
                    className="text-royal-900 hover:text-gold-500 transition-colors flex items-center gap-1 text-sm"
                  >
                    <Edit size={16} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No products found. Add your first product!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
