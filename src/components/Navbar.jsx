'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/store';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '@/components/NotificationBell';

export default function Navbar() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gold-500/20 bg-white/80 px-4 py-3 backdrop-blur-lg md:px-6 md:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-1 font-serif text-xl font-bold tracking-tight text-royal-900 transition-transform hover:scale-105 md:text-2xl"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Shree Samarth
          <span className="text-gold-500 transition-colors group-hover:text-gold-600">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden gap-8 md:flex">
          <NavLink href="/shop" pathname={pathname}>Collection</NavLink>
          <NavLink href="/customizer" pathname={pathname}>Customizer</NavLink>
          {/* <NavLink href="/about" pathname={pathname}>Atelier</NavLink> */}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Cart Icon */}
          <Link href="/checkout" className="group relative">
            <ShoppingBag className="h-5 w-5 text-gray-600 transition group-hover:text-royal-900 md:h-6 md:w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold text-white shadow-md md:h-5 md:w-5 md:text-[10px]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Login */}
          <div className="flex items-center">
            <SignedIn>
              <div className="flex items-center gap-4">
                <NotificationBell isAdmin={false} />
                <Link 
                  href="/orders" 
                  className="hidden text-sm font-medium text-gray-600 transition hover:text-royal-900 md:block"
                >
                  My Orders
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-1 text-sm font-medium text-royal-900 transition hover:text-gold-600 md:gap-2">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline">Login</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-royal-900 transition hover:text-gold-600 md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-full border-t border-gold-500/10 bg-white/95 px-6 py-6 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col space-y-4">
              <MobileNavLink href="/shop" onClick={() => setIsMenuOpen(false)}>
                Collection
              </MobileNavLink>
              {/* <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>
                Atelier
              </MobileNavLink> */}
              <SignedIn>
                <MobileNavLink href="/orders" onClick={() => setIsMenuOpen(false)}>
                  My Orders
                </MobileNavLink>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Desktop nav link with active state and gold underline on hover/active
function NavLink({ href, pathname, children }) {
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`group relative text-sm font-medium transition ${
        isActive ? 'text-royal-900' : 'text-gray-600 hover:text-royal-900'
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-gold-500 transition-all ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}

// Mobile nav link (simpler, but also shows active state)
function MobileNavLink({ href, onClick, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-2 text-base font-medium transition ${
        isActive ? 'text-royal-900' : 'text-gray-700 hover:text-royal-900'
      }`}
    >
      {children}
    </Link>
  );
}