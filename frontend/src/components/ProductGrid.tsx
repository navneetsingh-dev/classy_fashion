import { useState, useMemo } from 'react';
import { useBoutique } from '../context';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/mockProducts';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductGridProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const ProductGrid = ({
  selectedCategory,
  onCategorySelect,
}: ProductGridProps) => {
  const { products, activeDiscountCount } = useBoutique();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'discount'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All Collections') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-low') {
        const pA = a.basePrice * (1 - a.discountPercentage / 100);
        const pB = b.basePrice * (1 - b.discountPercentage / 100);
        return pA - pB;
      }
      if (sortBy === 'price-high') {
        const pA = a.basePrice * (1 - a.discountPercentage / 100);
        const pB = b.basePrice * (1 - b.discountPercentage / 100);
        return pB - pA;
      }
      if (sortBy === 'discount') {
        return b.discountPercentage - a.discountPercentage;
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Category Pills & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap rounded-full border ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search garments, fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-md placeholder-stone-400 text-stone-800 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products by"
              className="appearance-none pl-3 pr-8 py-1.5 text-xs bg-white border border-stone-200 rounded-md text-stone-700 font-medium focus:outline-none focus:border-stone-800 cursor-pointer"
            >
              <option value="featured">Featured Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Catalog Status Sub-header */}
      <div className="flex items-center justify-between py-4 text-xs text-stone-600">
        <span className="font-serif italic">
          Showing {filteredProducts.length} bespoke pieces
        </span>
        {activeDiscountCount > 0 && (
          <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            {activeDiscountCount} item{activeDiscountCount > 1 ? 's' : ''} on sale
          </span>
        )}
      </div>

      {/* Responsive Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="font-serif text-lg text-stone-600 mb-2">No garments matched your criteria</p>
          <p className="text-xs text-stone-400 mb-4">Try clearing filters or search queries</p>
          <button
            onClick={() => {
              setSearchQuery('');
              onCategorySelect('All Collections');
            }}
            className="px-4 py-2 border border-stone-300 text-stone-800 hover:border-stone-900 text-xs uppercase tracking-widest transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
