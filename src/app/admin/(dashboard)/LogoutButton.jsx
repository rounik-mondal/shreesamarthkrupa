'use client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex w-full items-center gap-3 p-3 rounded hover:bg-red-600 transition-colors text-red-100 hover:text-white"
    >
      <LogOut size={20} /> Logout
    </button>
  );
}
