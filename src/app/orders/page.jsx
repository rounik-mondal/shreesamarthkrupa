'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Package, Calendar, ArrowRight, MessageSquare } from 'lucide-react';

export default function OrdersPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchAll = async () => {
      try {
        const [ordersRes, requestsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/user/requests')
        ]);
        
        let allItems = [];
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          allItems = [...allItems, ...ordersData.map(o => ({ ...o, type: 'ORDER' }))];
        }
        
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          allItems = [...allItems, ...requestsData.map(r => ({ ...r, type: 'CUSTOM_REQUEST' }))];
        }

        // Sort by date descending
        allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(allItems);

      } catch (error) {
        console.error("Failed to load timeline");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <Loader2 className="h-10 w-10 animate-spin text-royal-900" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-12 md:px-12 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 font-serif text-4xl text-royal-900">My Collection</h1>
        <p className="mb-12 text-gray-500">History of your standard and bespoke acquisitions.</p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/50 p-20 text-center">
            <Package className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-xl font-medium text-royal-900">No orders yet</h3>
            <p className="mb-6 text-gray-500">Your collection awaits its first masterpiece.</p>
            <div className="flex gap-4">
              <Link href="/shop" className="bg-royal-900 px-6 py-2 text-white transition hover:bg-royal-800">
                Visit Gallery
              </Link>
              <Link href="/customizer" className="bg-gold-500 px-6 py-2 text-white transition hover:bg-gold-600">
                Bespoke Order
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-wrap gap-8 text-sm">
                    {item.type === 'CUSTOM_REQUEST' && (
                      <div className="flex items-center gap-2 font-bold text-royal-900 bg-royal-100 px-3 py-1 rounded-full">
                        <MessageSquare size={14} />
                        BESPOKE
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium text-royal-900">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      </p>
                    </div>
                    {item.totalAmount !== undefined && (
                      <div>
                        <p className="text-gray-500">Total Amount</p>
                        <p className="font-medium text-royal-900">₹{parseFloat(item.totalAmount || 0).toLocaleString('en-IN')}</p>
                      </div>
                    )}
                    {item.offeredPrice !== undefined && item.offeredPrice !== null && (
                      <div>
                        <p className="text-gray-500">Offered Price</p>
                        <p className="font-medium text-royal-900">₹{parseFloat(item.offeredPrice || 0).toLocaleString('en-IN')}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">ID #</p>
                      <p className="font-mono text-gray-600">{item.id.slice(-8).toUpperCase()}</p>
                    </div>
                    {item.trackingLink && (
                      <div>
                        <p className="text-gray-500">Tracking</p>
                        <a href={item.trackingLink} target="_blank" rel="noreferrer" className="font-medium text-gold-600 hover:underline">
                          Track Shipment <ArrowRight className="inline h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      item.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      Payment: {item.paymentStatus}
                    </div>
                    <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                      Status: {item.status.replace('_', ' ') || 'Processing'}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {item.type === 'ORDER' && item.items?.map((orderItem, idx) => (
                    <div key={idx} className="flex items-center gap-6 py-4 first:pt-0 last:pb-0">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                        {orderItem.image && <Image src={orderItem.image} alt={orderItem.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg text-royal-900">{orderItem.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {orderItem.quantity}</p>
                      </div>
                      <div className="text-right">
                         <Link href={`/shop/${orderItem.productId}`} className="text-sm font-medium text-royal-900 underline decoration-gold-400 underline-offset-4 hover:text-gold-600">
                            View Product
                         </Link>
                      </div>
                    </div>
                  ))}

                  {item.type === 'CUSTOM_REQUEST' && (
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <h4 className="font-serif text-lg text-royal-900 mb-2">Customization Request</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.details}</p>
                      </div>
                      <div className="text-right shrink-0">
                         <Link href={`/customizer/${item.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-white bg-royal-900 px-4 py-2 rounded transition hover:bg-royal-800">
                            Review & Pay <ArrowRight className="h-4 w-4" />
                         </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}