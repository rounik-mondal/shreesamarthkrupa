'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Script from 'next/script';
import { Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/lib/ToastContext';

export default function CustomizerReviewClient({ request }) {
  const router = useRouter();
  const { user } = useUser();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Ask backend to create a Razorpay Order for this Custom Request
      const response = await fetch(`/api/customizer/${request.id}/pay`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error("Failed to initialize payment");
      
      const { razorpayOrderId } = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RGJbfhsGalIzgh',
        amount: Math.round(request.offeredPrice * 100),
        currency: "INR",
        name: "Shree Samarth Krupa",
        description: "Bespoke Customization",
        order_id: razorpayOrderId,
        handler: async function (res) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/verify-custom', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(res)
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              toast.success("Payment successful! Your order is now in production.");
              router.refresh();
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Payment verification error.");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#1a1a1a"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isPending = request.status === 'PENDING';
  const hasOffer = request.status === 'OFFER_MADE';
  const isPaid = request.status === 'PAID' || request.status === 'IN_PRODUCTION' || request.status === 'SHIPPED' || request.status === 'DELIVERED';

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gold-500/20 space-y-8">
        
        {/* User Request */}
        <div>
          <h2 className="text-xl font-serif text-royal-900 mb-2">Your Request</h2>
          <div className="bg-gray-50 p-4 rounded text-gray-700 whitespace-pre-wrap">
            {request.details}
          </div>
        </div>

        {/* Status / Offer Box */}
        {isPending && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center gap-4 text-yellow-800">
            <Loader2 className="animate-spin h-5 w-5" />
            <div>
              <p className="font-medium">Evaluating your request...</p>
              <p className="text-sm opacity-90">Our artisans are reviewing the details and will provide an estimated cost shortly.</p>
            </div>
          </div>
        )}

        {hasOffer && (
          <div className="bg-royal-50 border border-royal-200 p-6 rounded-lg space-y-4">
            <div>
              <h2 className="text-xl font-serif text-royal-900 mb-1">Offer Received</h2>
              <p className="text-sm text-gray-600">The artisans have reviewed your request and provided an estimate.</p>
            </div>
            
            {request.adminNote && (
              <div className="bg-white p-4 rounded border border-royal-100 text-sm text-gray-700 italic">
                "{request.adminNote}"
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-royal-100">
              <span className="text-gray-600 font-medium">Estimated Price</span>
              <span className="text-2xl font-bold text-royal-900">₹{request.offeredPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 uppercase tracking-widest flex justify-center items-center transition-colors"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              Accept & Pay
            </button>
          </div>
        )}

        {isPaid && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg space-y-4">
            <div>
              <h2 className="text-xl font-serif text-green-900 mb-1">Payment Successful</h2>
              <p className="text-sm text-green-700">Your bespoke order is confirmed and being processed.</p>
            </div>
            
            <div className="flex justify-between border-b border-green-200 pb-2">
              <span className="text-green-800">Status</span>
              <span className="font-bold text-green-900">{request.status.replace('_', ' ')}</span>
            </div>

            {request.trackingLink && (
              <div className="pt-2">
                <a href={request.trackingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-royal-900 font-medium hover:underline">
                  Track Shipment <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}
