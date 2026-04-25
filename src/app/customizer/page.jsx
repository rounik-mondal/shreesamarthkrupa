'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useToast } from '@/lib/ToastContext';

export default function CustomizerPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const toast = useToast();
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <Loader2 className="h-10 w-10 animate-spin text-royal-900" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-cream">
        <h2 className="text-2xl font-serif text-royal-900 mb-4">Please Sign In</h2>
        <p className="text-gray-600 mb-6">You must be logged in to request a custom order.</p>
        <button onClick={() => router.push('/sign-in?redirect_url=/customizer')} className="bg-royal-900 text-white px-6 py-2">
          Sign In
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/customizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details })
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Request submitted successfully! We will get back to you with an estimation.");
      router.push('/orders'); // Redirect to their orders/collection page
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-12 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gold-500/20">
        <h1 className="text-3xl font-serif text-royal-900 mb-2">Bespoke Customization</h1>
        <p className="text-gray-600 mb-8">
          Describe exactly what you are looking for. Our artisans will review your request and provide an estimated offer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Customization Details
            </label>
            <textarea
              required
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g., I would like a 3-seater sofa with velvet fabric, gold-plated legs, and specific dimensions..."
              className="w-full border border-gray-300 p-4 rounded-md focus:outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 uppercase tracking-widest flex justify-center items-center transition-colors"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Request Estimation'}
          </button>
        </form>
      </div>
    </main>
  );
}
