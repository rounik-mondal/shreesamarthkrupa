'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { useCart } from '@/lib/store';

export default function ProductConfigurator({ product }) {
  const basePrice = Number(product.basePrice);
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [selections, setSelections] = useState({});
  // Fallback to placeholder if no images exist to prevent crash
  const [currentImage, setCurrentImage] = useState(product.images?.[0] || '/placeholder.jpg');

  const addItem = useCart((state) => state.addItem);

  // 1. Initialize Defaults
  useEffect(() => {
    if (product.options && product.options.steps) {
      const defaults = {};
      let initialPrice = basePrice;

      product.options.steps.forEach(step => {
        // Handle "Select" types (like Fabrics)
        if (step.type === 'select' && step.choices && step.choices.length > 0) {
          const firstChoice = step.choices[0];
          defaults[step.id] = firstChoice;
          initialPrice += (firstChoice.price || 0);
        }
        // Handle "Measurement" types (like Wallpaper size)
        else if (step.type === 'measurement') {
          defaults[step.id] = { 
            value: step.validation?.minWidth || 10, // Default to min width
            unit: step.validation?.unit || 'sqft'
          };
        }
      });

      setSelections(defaults);
      setTotalPrice(initialPrice);
    }
  }, [product, basePrice]);

  // 2. Handle Selection (Buttons)
  const handleSelect = (stepId, choice) => {
    const newSelections = { ...selections, [stepId]: choice };
    setSelections(newSelections);

    recalculatePrice(newSelections);

    if (choice.image) {
      setCurrentImage(choice.image);
    }
  };

  // 3. Handle Input Changes (Numbers)
  const handleInputChange = (stepId, value, unit) => {
    const newSelections = { ...selections, [stepId]: { value: Number(value), unit } };
    setSelections(newSelections);
  };

  const recalculatePrice = (currentSelections) => {
    let newPrice = basePrice;
    
    // Add up costs from "Select" options
    Object.values(currentSelections).forEach(selected => {
      // Check if it's an object with a price property
      if (selected && typeof selected === 'object' && selected.price) {
        newPrice += selected.price;
      }
    });
    
    setTotalPrice(newPrice);
  };

  const handleAddToCart = () => {
    // Add to Zustand Store
    addItem({
        ...product,
        price: totalPrice,
        customization: selections,
        image: currentImage
    });
    // alert("Added to cart!"); // Simple feedback
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* LEFT: Image */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-100 lg:h-[80vh] lg:sticky lg:top-24">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image
            src={currentImage}
            alt="Product"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>

      {/* RIGHT: Controls */}
      <div className="flex flex-col justify-center px-4 py-12 lg:px-12">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-gold-600">
          {product.category}
        </div>
        <h1 className="mb-4 font-serif text-4xl text-royal-900 md:text-5xl">
          {product.name}
        </h1>
        <p className="mb-8 text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Dynamic Options */}
        <div className="space-y-8">
          {product.options?.steps?.map((step) => (
            <div key={step.id}>
              <span className="mb-3 block text-sm font-bold uppercase tracking-wider text-royal-900">
                {step.name}
              </span>

              {/* RENDER: Choice Buttons */}
              {step.type === 'select' && step.choices && (
                <div className="flex flex-wrap gap-3">
                  {step.choices.map((choice) => {
                    const isSelected = selections[step.id]?.value === choice.value;
                    return (
                      <button
                        key={choice.value}
                        onClick={() => handleSelect(step.id, choice)}
                        className={`
                          relative flex items-center justify-center gap-2 rounded-sm border px-4 py-3 text-sm transition-all
                          ${isSelected 
                            ? 'border-royal-900 bg-royal-900 text-white' 
                            : 'border-gray-300 hover:border-royal-900 text-gray-700'
                          }
                        `}
                      >
                        {choice.label}
                        {choice.price > 0 && (
                          <span className="text-xs opacity-70">(+₹{choice.price})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* RENDER: Number Input (For Wallpapers) */}
              {step.type === 'measurement' && (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input 
                      type="number" 
                      min={step.validation?.minWidth} 
                      max={step.validation?.maxWidth}
                      className="w-32 border border-gray-300 p-3 text-royal-900 focus:border-gold-500 focus:outline-none"
                      placeholder="Size"
                      onChange={(e) => handleInputChange(step.id, e.target.value, step.validation.unit)}
                    />
                    <span className="absolute right-4 top-3 text-gray-400 text-sm uppercase">
                      {step.validation?.unit}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    (Min: {step.validation?.minWidth} {step.validation?.unit})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer: Price & Cart */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="mb-6 flex items-end justify-between">
            <span className="text-sm text-gray-500">Total Estimation</span>
            <span className="font-serif text-3xl text-royal-900">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-gold-500 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-gold-600"
          >
            Add to Order Request
          </button>
        </div>
      </div>
    </div>
  );
}