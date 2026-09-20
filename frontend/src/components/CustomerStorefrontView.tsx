import { useState, useRef } from 'react';
import { StorefrontNavbar } from './StorefrontNavbar';
import { Hero } from './Hero';
import { ProductGrid } from './ProductGrid';
import { CartDrawer } from './CartDrawer';
import { Sparkles, Scissors, Clock, ShieldCheck, Mail } from 'lucide-react';

export const CustomerStorefrontView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Collections');
  const collectionRef = useRef<HTMLDivElement>(null);

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-full flex flex-col bg-white text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Pane Identifier Banner */}
      <div className="bg-stone-900 text-stone-200 px-4 py-2 text-xs flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono uppercase tracking-widest text-[11px] text-stone-300">
            Customer Storefront
          </span>
          <span className="text-stone-500 text-[10px] hidden sm:inline">• Live Client View</span>
        </div>
        <div className="text-[10px] tracking-wider text-amber-300 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Real-Time Connected</span>
        </div>
      </div>

      {/* Navigation */}
      <StorefrontNavbar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Hero Banner */}
      <Hero onExploreClick={scrollToCollection} />

      {/* Product Catalog Section */}
      <div ref={collectionRef}>
        <ProductGrid
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>

      {/* Atelier Experience Section */}
      <section className="bg-stone-50 border-t border-b border-stone-200 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-stone-500 block mb-2">
            The Bespoke Standard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-4">
            Master Craftsmanship Without Compromise
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed mb-8">
            Every garment from Classy Tailors undergoes over 40 hours of rigorous hand-tailoring. 
            From floating horsehair canvas to mother-of-pearl hardware, we redefine quiet luxury.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <div className="p-4 bg-white border border-stone-200/80 rounded-sm">
              <Scissors className="w-5 h-5 text-stone-800 mb-2.5" />
              <h4 className="font-serif text-sm font-medium text-stone-900 mb-1">Custom Measurements</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Complimentary tailor visit in metropolitan salons or guided digital profiling.
              </p>
            </div>
            <div className="p-4 bg-white border border-stone-200/80 rounded-sm">
              <Clock className="w-5 h-5 text-stone-800 mb-2.5" />
              <h4 className="font-serif text-sm font-medium text-stone-900 mb-1">Lifetime Alterations</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Enjoy seamless seasonal fitting adjustments on all bespoke garments.
              </p>
            </div>
            <div className="p-4 bg-white border border-stone-200/80 rounded-sm">
              <ShieldCheck className="w-5 h-5 text-stone-800 mb-2.5" />
              <h4 className="font-serif text-sm font-medium text-stone-900 mb-1">Provenance Guarantee</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Certified fabrics from Biella, Huddersfield, and Lyon with origin certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-4 sm:px-6 text-stone-500 text-xs mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-6">
          <div>
            <p className="font-serif text-sm tracking-widest text-stone-900 uppercase font-medium">Classy Tailors</p>
            <p className="text-[11px] text-stone-600 mt-0.5">London • Milan • New York • Paris</p>
          </div>
          <div className="flex items-center gap-2 text-stone-600 text-xs">
            <Mail className="w-3.5 h-3.5" />
            <span>concierge@classytailors.com</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-600">
          <p>© 2026 Classy Tailors Bespoke Atelier Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Client Privacy</span>
            <span>Atelier Terms</span>
            <span>Bespoke Protocol</span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
