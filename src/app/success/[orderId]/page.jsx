import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default async function SuccessPage({ params }) {
  // In a real app, you would fetch the order details here to show a receipt
  const { orderId } = await params;
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600">
        <CheckCircle className="h-16 w-16" />
      </div>
      
      <h1 className="mb-4 font-serif text-4xl text-royal-900">Order Confirmed!</h1>
      <p className="mb-8 max-w-md text-gray-600">
        Thank you for choosing Shree Samarth Krupa. Your bespoke order #{orderId} has been sent to our manufacturing team.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/shop" 
          className="bg-royal-900 px-8 py-3 text-white transition-colors hover:bg-royal-800"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}