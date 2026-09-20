import { useBoutique } from '../context';
import { ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';

interface StorefrontNavbarProps {
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
}

export const StorefrontNavbar = ({
  onCategorySelect,
  selectedCategory = 'All Collections',
}: StorefrontNavbarProps) => {
  const { cartCount, setIsCartOpen, activeSaleNotice, cartTotal } = useBoutique();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Luxury Announcement Bar */}
      <div className={`px-4 py-1.5 text-center text-xs tracking-wider transition-colors duration-300 ${
        activeSaleNotice 
          ? 'bg-stone-900 text-amber-300 font-medium' 
          : 'bg-stone-100 text-stone-600'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {activeSaleNotice ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="uppercase">{activeSaleNotice}</span>
              <span className="hidden sm:inline">• Live Discount Applied Automatically</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Complimentary Bespoke Fitting & Worldwide White-Glove Delivery</span>
            </>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex flex-col">
          <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] font-semibold text-stone-900 uppercase">
            Classy Tailors
          </span>
          <span className="text-[9px] tracking-[0.35em] text-stone-600 uppercase font-sans">
            Haute Couture • Bespoke Atelier
          </span>
        </div>

        {/* Quick Collections (Desktop) */}
        {onCategorySelect && (
          <nav className="hidden xl:flex items-center space-x-6 text-xs tracking-widest uppercase font-medium text-stone-600">
            {['All Collections', 'Bespoke Tailoring', 'Evening Wear', 'Outerwear'].map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`transition-colors py-1 border-b-2 ${
                  selectedCategory === cat
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-3 py-2 rounded-full border border-stone-300 hover:border-stone-900 transition-colors bg-white text-stone-900 group"
            aria-label="View Shopping Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-stone-800 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-stone-900 text-amber-300 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium tracking-wider hidden sm:inline">
              Bag {cartTotal > 0 ? `($${cartTotal.toLocaleString()})` : ''}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
