'use client';

import { useCart } from '@/lib/store';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { items, removeItem, closeCart, isCartOpen } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop (Dark Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b p-6">
                <h2 className="font-serif text-2xl text-royal-900">Your Request</h2>
                <button onClick={closeCart} className="rounded-full p-2 hover:bg-gray-100">
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-gray-400">
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.uniqueId} className="flex gap-4">
                        {/* Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-serif text-lg text-royal-900">{item.name}</h3>
                            {/* Show Customizations */}
                            <div className="mt-1 text-xs text-gray-500">
                              {Object.entries(item.customization).map(([key, val]) => (
                                <p key={key} className="capitalize">
                                  {key}: {val.label || val.value}
                                </p>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-royal-900">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                            <button 
                              onClick={() => removeItem(item.uniqueId)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t bg-cream p-6">
                  <div className="mb-4 flex justify-between text-lg font-bold text-royal-900">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-royal-900 py-4 text-gray-500 hover:bg-royal-800"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}