import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare } from 'lucide-react';
import LogoutButton from './LogoutButton';
import NotificationBell from '@/components/NotificationBell';

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-royal-900 text-white flex flex-col h-full shrink-0">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Admin Panel</h1>
          <NotificationBell isAdmin={true} />
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded hover:bg-royal-800 transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded hover:bg-royal-800 transition-colors">
            <Package size={20} /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded hover:bg-royal-800 transition-colors">
            <ShoppingCart size={20} /> Orders
          </Link>
          <Link href="/admin/requests" className="flex items-center gap-3 p-3 rounded hover:bg-royal-800 transition-colors">
            <MessageSquare size={20} /> Custom Requests
          </Link>
        </nav>
        <div className="p-4 border-t border-royal-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
