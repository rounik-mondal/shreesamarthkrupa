'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Package, Calendar, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
        <p className="mb-12 text-gray-500">History of your bespoke acquisitions.</p>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/50 p-20 text-center">
            <Package className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-xl font-medium text-royal-900">No orders yet</h3>
            <p className="mb-6 text-gray-500">Your collection awaits its first masterpiece.</p>
            <Link href="/shop" className="bg-royal-900 px-6 py-2 text-white transition hover:bg-royal-800">
              Visit Gallery
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-wrap gap-8 text-sm">
                    <div>
                      <p className="text-gray-500">Order Placed</p>
                      <p className="font-medium text-royal-900">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="font-medium text-royal-900">₹{parseFloat(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Order #</p>
                      <p className="font-mono text-gray-600">{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                    {order.trackingLink && (
                      <div>
                        <p className="text-gray-500">Tracking</p>
                        <a href={order.trackingLink} target="_blank" rel="noreferrer" className="font-medium text-gold-600 hover:underline">
                          Track Shipment <ArrowRight className="inline h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      Payment: {order.paymentStatus}
                    </div>
                    <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                      Status: {order.status.replace('_', ' ') || 'Processing'}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 py-4 first:pt-0 last:pb-0">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                         {/* Fallback image if item.image is missing */}
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg text-royal-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                         <Link href={`/shop/${item.productId}`} className="text-sm font-medium text-royal-900 underline decoration-gold-400 underline-offset-4 hover:text-gold-600">
                            Buy Again
                         </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}