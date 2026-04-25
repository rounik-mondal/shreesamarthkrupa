'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/lib/ToastContext';

export default function OrderDetailsClient({ order }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [trackingLink, setTrackingLink] = useState(order.trackingLink || '');

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingLink })
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Order updated successfully!');
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['PENDING', 'CONFIRMED', 'FABRIC_CUTTING', 'STITCHING', 'READY_TO_SHIP', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Col: Items & Customer */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-royal-900 mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
                <div className="relative h-20 w-20 bg-gray-100 rounded overflow-hidden">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized={item.image.startsWith('http')} />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                  </p>
                  {item.selectedConfig && (
                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded text-gray-600">
                      {Object.entries(item.selectedConfig).map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span className="font-semibold capitalize">{k}:</span>
                          <span>{v?.label || v?.value || v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-royal-900 mb-4">Customer Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Name</p>
              <p className="font-medium">{order.user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <p className="font-medium">{order.user?.email}</p>
            </div>
            {/* Note: The checkout saves shipping info but currently your DB Order schema lacks shipping address fields. We assume Clerk has it or it's saved in a json field if added. */}
          </div>
        </div>
      </div>

      {/* Right Col: Manage Status */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-royal-900 mb-4">Manage Order</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
                order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {order.paymentStatus}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900"
              >
                {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Link</label>
              <input 
                type="url" 
                placeholder="https://..."
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900"
              />
            </div>

            <button 
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-royal-900 text-white py-2 rounded font-medium hover:bg-royal-800 transition flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Update Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
