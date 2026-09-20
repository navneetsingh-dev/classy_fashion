import { useState } from 'react';
import { useBoutique } from '../context';
import { calculateDiscountedPrice } from '../utils/pricing';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartOriginalTotal,
    cartSavings,
  } = useBoutique();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('CT-849201');

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setOrderId(`CT-${Math.floor(100000 + Math.random() * 900000)}`);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#cca552', '#1c1917', '#e7d4a7'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 1000);
  };

  const handleFinishOrder = () => {
    clearCart();
    setOrderComplete(false);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-stone-800" />
              <h2 className="font-serif text-lg font-medium text-stone-900 tracking-wide">
                Boutique Shopping Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900">Order Confirmed</h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-xs">
                  Your bespoke atelier order has been placed. Our master tailors are preparing your garments with white-glove care.
                </p>
                <div className="bg-stone-50 p-4 border border-stone-200 text-left w-full text-xs text-stone-700 space-y-1 rounded">
                  <div className="flex justify-between font-semibold">
                    <span>Order Reference:</span>
                    <span className="font-mono">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="font-semibold">${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Delivery:</span>
                    <span>Complimentary Express Courier</span>
                  </div>
                </div>
                <button
                  onClick={handleFinishOrder}
                  className="w-full py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors"
                >
                  Return to Boutique
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 stroke-[1.5]" />
                <h3 className="font-serif text-lg text-stone-700">Your shopping bag is empty</h3>
                <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                  Discover our curated pieces from Savile Row wools to Italian silks and add them to your bag.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 border border-stone-300 text-stone-800 hover:border-stone-900 text-xs uppercase tracking-widest transition-colors font-medium"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const hasDiscount = item.product.discountPercentage > 0;
                  const unitPrice = calculateDiscountedPrice(
                    item.product.basePrice,
                    item.product.discountPercentage
                  );

                  return (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-4 p-3.5 border border-stone-200/80 bg-white hover:border-stone-300 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-24 bg-stone-100 shrink-0 overflow-hidden">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-sm font-medium text-stone-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Size: <span className="font-medium text-stone-700">{item.size}</span>
                          </p>

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-xs font-semibold text-stone-900">
                              ${unitPrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] text-stone-400 line-through">
                                ${item.product.basePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                          <div className="inline-flex items-center border border-stone-200 rounded">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-medium text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-medium text-stone-900">
                            ${(unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Totals & Checkout */}
          {!orderComplete && cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartOriginalTotal.toLocaleString()}</span>
                </div>

                {cartSavings > 0 && (
                  <div className="flex justify-between text-amber-800 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Atelier Discount Savings
                    </span>
                    <span>-${cartSavings.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span className="text-emerald-700 font-medium uppercase tracking-wider text-[11px]">
                    Complimentary
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-semibold text-stone-900">
                  <span>Total Investment</span>
                  <span className="font-serif text-base">${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full min-h-[46px] bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.99] text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isCheckingOut ? (
                  <span>Processing Bespoke Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-600 uppercase tracking-widest pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Encrypted Transaction • 100% Authentic Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
