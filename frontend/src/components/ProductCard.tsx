import { useState } from 'react';
import type { Product } from '../types';
import { useBoutique } from '../context';
import { calculateDiscountedPrice } from '../utils/pricing';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const AVAILABLE_SIZES = ['38R / S', '40R / M', '42R / L', '44R / XL'];

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, lastUpdatedProductId } = useBoutique();
  const [selectedSize, setSelectedSize] = useState<string>('40R / M');
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = calculateDiscountedPrice(product.basePrice, product.discountPercentage);
  const isRecentlyUpdated = lastUpdatedProductId === product.id;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setIsAdding(true);
    addToCart(product, selectedSize);
    setTimeout(() => setIsAdding(false), 700);
  };

  return (
    <div
      className={`group relative flex flex-col bg-white border transition-all duration-300 ${
        isRecentlyUpdated
          ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg scale-[1.01]'
          : 'border-stone-200/80 hover:border-stone-400 hover:shadow-md'
      }`}
    >
      {/* Real-time Update Indicator Pill */}
      {isRecentlyUpdated && (
        <div className="absolute top-3 right-3 z-20 bg-stone-900 text-amber-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-bounce">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Live Sync Updated</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400 text-xs font-serif">
            Classy Tailors
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 bg-stone-900 text-amber-300 text-[11px] font-medium tracking-wider uppercase shadow">
              -{product.discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Stock Status Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-stone-900 text-stone-200 text-xs uppercase tracking-widest font-medium border border-stone-700">
              Temporarily Reserved
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Fabric */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-stone-600 mb-1.5">
            <span>{product.category}</span>
            {hasDiscount && (
              <span className="text-amber-700 font-medium">Limited Atelier Sale</span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-stone-900 line-clamp-1 mb-2">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div>
          {/* CRITICAL: Dynamic Price Display */}
          <div className="flex items-baseline gap-2.5 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-lg sm:text-xl font-semibold text-stone-900">
                  ${discountedPrice.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm text-stone-600 line-through">
                  ${product.basePrice.toLocaleString()}
                </span>
                <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Save ${(product.basePrice - discountedPrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-xl font-medium text-stone-900">
                ${product.basePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div className="mb-4">
            <label className="block text-[10px] uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
              Select Size:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 text-[10px] sm:text-[11px] font-medium tracking-wide uppercase transition-all rounded-xs border ${
                    selectedSize === size
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400 hover:bg-white'
                  }`}
                >
                  {size.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Touch-Friendly Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest font-medium transition-all duration-200 ${
              !product.inStock
                ? 'bg-stone-200 text-stone-600 cursor-not-allowed border border-stone-300'
                : isAdding
                ? 'bg-stone-800 text-white'
                : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.99] shadow-sm'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 animate-in zoom-in" />
                <span>Added to Bag</span>
              </>
            ) : !product.inStock ? (
              <span>Unavailable</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-stone-300" />
                <span>Add to Shopping Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
