'use client';

import { useCart } from '@/lib/store';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from '@/lib/ToastContext';

export default function CheckoutPage() {
  const { items, clearCart, removeItem, updateQuantity } = useCart();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const toast = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    if (isLoaded && items.length === 0 && !isSuccess) {
      router.push('/shop');
    }
  }, [items, isLoaded, router, isSuccess]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create order on backend (returns Razorpay Order ID)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingDetails: formData }), 
      });

      if (!response.ok) {
        const errorMsg = await response.text(); 
        throw new Error(errorMsg || 'Failed to initialize order');
      }

      const data = await response.json();
      const { razorpayOrderId, id: orderId } = data;

      if (!razorpayOrderId) throw new Error("Payment gateway initialization failed.");

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RGJbfhsGalIzgh', // Fallback or from env
        amount: Math.round(subtotal * 100),
        currency: "INR",
        name: "Shree Samarth Krupa",
        description: "Luxury Furnishing",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setIsSuccess(true);
              clearCart();
              router.push(`/success/${verifyData.orderId}`);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification error.");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: formData.phone
        },
        theme: {
          color: "#1a1a1a" // royal-900 approx
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      // Stop submitting state so user can interact
      setIsSubmitting(false);
      
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(`Order Failed: ${error.message}`);
      setIsSubmitting(false);
    } 
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <Loader2 className="h-10 w-10 animate-spin text-royal-900" />
      </div>
    );
  }

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    <main className="min-h-screen bg-cream px-4 py-12 md:px-12 lg:px-24">
      <h1 className="mb-12 font-serif text-4xl text-royal-900">Secure Checkout</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        
        {/* LEFT COLUMN: User & Shipping Info */}
        <div>
          {!isSignedIn ? (
            <div className="rounded-lg border border-gold-400 bg-white p-8 text-center shadow-lg">
              <h2 className="mb-4 font-serif text-2xl text-royal-900">Account Required</h2>
              <p className="mb-6 text-gray-600">Please sign in to place your luxury order.</p>
              
              <SignInButton mode="modal" forceRedirectUrl="/checkout" signUpForceRedirectUrl="/checkout">
                <button className="bg-royal-900 px-8 py-3 text-white transition-colors hover:bg-royal-800">
                  Sign In / Sign Up
                </button>
              </SignInButton>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="mb-6 font-serif text-2xl text-royal-900">Shipping Details</h2>
                
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-gray-500">Name</label>
                    <input 
                      type="text" 
                      value={user.fullName || ''} 
                      disabled 
                      className="w-full cursor-not-allowed bg-gray-100 p-3 text-gray-500 border border-gray-200" 
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-500">Email</label>
                    <input 
                      type="text" 
                      value={user.primaryEmailAddress?.emailAddress || ''} 
                      disabled 
                      className="w-full cursor-not-allowed bg-gray-100 p-3 text-gray-500 border border-gray-200" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <input 
                      name="address"
                      required 
                      placeholder="Address Line 1" 
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      name="city"
                      required 
                      placeholder="City" 
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900" 
                    />
                    <input 
                      name="pincode"
                      required 
                      placeholder="Pincode" 
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900" 
                    />
                  </div>
                  
                  <div>
                    <input 
                      name="phone"
                      required 
                      type="tel"
                      placeholder="Phone Number" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900" 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex w-full items-center justify-center bg-gold-500 py-4 font-bold uppercase tracking-widest text-white transition-colors hover:bg-gold-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${subtotal.toLocaleString('en-IN')}`
                )}
              </button>
              <p className="text-center text-xs text-gray-400">
                Secure SSL Encrypted Payment
              </p>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="h-fit rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 font-serif text-2xl text-royal-900">Order Summary</h2>
          
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.uniqueId} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
                {/* Product Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-serif text-royal-900">{item.name}</h3>
                        {/* DELETE BUTTON */}
                        <button 
                            onClick={() => removeItem(item.uniqueId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                      {Object.entries(item.customization).map(([key, val]) => (
                        <span key={key} className="bg-gray-100 px-2 py-0.5 rounded capitalize">
                          {val.label || val.value}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 border border-gray-200 rounded-md bg-gray-50 px-2 py-1">
                        <button 
                            onClick={() => updateQuantity(item.uniqueId, 'decrease')}
                            className="text-gray-500 hover:text-royal-900 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-medium text-gray-900 w-4 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.uniqueId, 'increase')}
                            className="text-gray-500 hover:text-royal-900"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                    <span className="font-bold text-royal-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Totals Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="mb-2 flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="mb-4 flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-royal-900">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
    </>
  );
}