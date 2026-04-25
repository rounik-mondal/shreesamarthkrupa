import { Playfair_Display, Lato } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import CartDrawer from "@/components/CartDrawer";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/lib/ToastContext";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({ 
  subsets: ["latin"], 
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata = {
  title: "Shree Samarth Krupa | Bespoke Luxury Living",
  description: "Premium handcrafted sofas, wallpapers, and home decor.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} bg-cream text-royal-900 antialiased`}>
        <ToastProvider>
          <Navbar/>
          {children}
          <CartDrawer />
        </ToastProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}