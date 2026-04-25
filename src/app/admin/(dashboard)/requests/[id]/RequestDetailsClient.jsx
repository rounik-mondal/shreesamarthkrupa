'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/lib/ToastContext';

export default function RequestDetailsClient({ request }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [offeredPrice, setOfferedPrice] = useState(request.offeredPrice || '');
  const [adminNote, setAdminNote] = useState(request.adminNote || '');
  const [status, setStatus] = useState(request.status);
  const [trackingLink, setTrackingLink] = useState(request.trackingLink || '');

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests/${request.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          offeredPrice: offeredPrice ? Number(offeredPrice) : null, 
          adminNote, 
          status,
          trackingLink 
        })
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Request updated successfully!');
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isPaid = request.status === 'PAID' || request.status === 'IN_PRODUCTION' || request.status === 'SHIPPED' || request.status === 'DELIVERED';
  const postPaymentStatuses = ['PAID', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED'];
  const prePaymentStatuses = ['PENDING', 'OFFER_MADE', 'REJECTED'];
  
  const isOfferSent = request.status === 'OFFER_MADE';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Customer Request Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-serif text-royal-900 mb-4">Customer Needs</h2>
        <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 whitespace-pre-wrap">
          {request.details}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          User ID: {request.userId}
        </div>
      </div>

      {/* Admin Offer & Fulfillment */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-xl font-serif text-royal-900 mb-4">Manage Request</h2>

        {!isPaid ? (
          <>
            {isOfferSent && (
              <div className="bg-blue-50 text-blue-800 p-4 rounded text-sm mb-4 border border-blue-200">
                Offer has been sent to the customer. Waiting for their payment.
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                disabled={isOfferSent}
                className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500"
              >
                {prePaymentStatuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Price (₹)</label>
              <input 
                type="number" 
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                disabled={isOfferSent}
                className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message to Customer</label>
              <textarea 
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                disabled={isOfferSent}
                className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-50 p-4 rounded text-green-800 mb-4 font-medium">
              Payment Completed! Amount: ₹{request.offeredPrice}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fulfillment Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {postPaymentStatuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Link</label>
              <input 
                type="url" 
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        {!isPaid && isOfferSent ? (
          <button 
            disabled
            className="w-full bg-gray-300 text-gray-600 py-2 rounded font-medium mt-4 cursor-not-allowed"
          >
            Awaiting Customer Payment
          </button>
        ) : (
          <button 
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-royal-900 text-white py-2 rounded font-medium mt-4 flex items-center justify-center hover:bg-royal-800"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Update Status'}
          </button>
        )}
      </div>
    </div>
  );
}
