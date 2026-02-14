'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, X, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  // 1. STATE Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(100000);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 2. FETCH Real Data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 3. DYNAMIC CATEGORIES (Extract from data)
  const categories = useMemo(() => {
    // Get unique categories from loaded products
    const uniqueCats = Array.from(new Set(products.map(p => p.category)));
    return ["All", ...uniqueCats];
  }, [products]);

  // 4. FILTER Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productPrice = Number(product.basePrice); // Ensure it's a number

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = productPrice <= priceRange;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [products, selectedCategory, priceRange, searchQuery]);

  return (
    <main className="min-h-screen bg-[#FDFBF7]">

      {/* --- HERO HEADER --- */}
      <div className="bg-[#231226] py-16 text-center text-white shadow-lg">
        <h1 className="font-serif text-5xl tracking-wide">The Collection</h1>
        <p className="mt-4 text-gold-400 font-light tracking-widest uppercase text-sm">
          Curated excellence for the discerning connoisseur
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex flex-col gap-10 lg:flex-row">

          {/* --- SIDEBAR FILTERS --- */}
          <aside className={`fixed inset-0 z-40 h-full w-80 bg-white p-6 shadow-2xl transition-transform lg:static lg:block lg:h-auto lg:w-64 lg:bg-transparent lg:p-0 lg:shadow-none ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

            <div className="flex items-center justify-between mb-8 lg:hidden">
              <h2 className="font-serif text-2xl text-royal-900">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}><X className="h-6 w-6" /></button>
            </div>

            {/* Search */}
            <div className="relative mb-10">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-royal-900 focus:ring-1 focus:ring-royal-900 transition-all shadow-sm"
              />
            </div>

            {/* Categories */}
            <div className="mb-10">
              <h3 className="mb-4 font-serif text-xl text-royal-900 border-b border-gray-200 pb-2">Categories</h3>
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat} className="group flex items-center gap-3 cursor-pointer">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedCategory === cat ? 'border-royal-900' : 'border-gray-400'}`}>
                      {selectedCategory === cat && <div className="h-3 w-3 rounded-full bg-royal-900" />}
                    </div>
                    <input
                      type="radio"
                      name="category"
                      className="hidden"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                    />
                    <span className={`text-sm transition-colors capitalize ${selectedCategory === cat ? 'font-medium text-royal-900' : 'text-gray-600 group-hover:text-royal-900'}`}>
                      {cat.toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="font-serif text-xl text-royal-900">Max Price</h3>
                <span className="text-sm font-bold text-gold-600">
                  ₹{priceRange.toLocaleString('en-IN')}
                </span>              </div>
              <input
                type="range"
                min="0"
                max="200000" // Increased max for luxury items
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-royal-900"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500 font-medium">
                <span>₹0</span>
                <span>₹2L+</span>
              </div>
            </div>
          </aside>

          {/* Overlay for Mobile Sidebar */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setShowMobileFilters(false)} />
          )}

          {/* --- PRODUCT GRID --- */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-500">
                Showing <span className="text-royal-900 font-bold">{filteredProducts.length}</span> results
              </p>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
            </div>

            {/* LOADING STATE */}
            {loading ? (
              <div className="flex h-64 w-full items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-royal-900" />
                  <span className="text-sm text-gray-500">Curating collection...</span>
                </div>
              </div>
            ) : (
              /* GRID */
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    // USE YOUR NEW CARD COMPONENT HERE
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-serif text-royal-900">No treasures found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => { setSelectedCategory("All"); setPriceRange(200000); setSearchQuery(""); }}
                  className="rounded-full bg-royal-900 px-8 py-2 text-white transition hover:bg-royal-800"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}