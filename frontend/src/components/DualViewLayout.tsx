import { useBoutique } from '../context';
import { CustomerStorefrontView } from './CustomerStorefrontView';
import { AdminDashboard } from './AdminDashboard';
import { ToastContainer } from './Toast';
import {
  Columns2,
  Store,
  Sliders,
  ArrowLeftRight,
} from 'lucide-react';

export const DualViewLayout = () => {
  const {
    viewMode,
    setViewMode,
    mobileView,
    setMobileView,
    cartCount,
    activeDiscountCount,
  } = useBoutique();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* MOBILE SCREEN INTERFACE (< lg): Side-by-side disabled, sticky toggle bar */}
      {/* ========================================================================= */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-300 shadow-sm">
        {/* Mobile View Switcher Tabs */}
        <div className="p-2 max-w-md mx-auto">
          <div className="grid grid-cols-2 p-1 bg-stone-200/80 rounded-lg gap-1">
            {/* Storefront Tab */}
            <button
              type="button"
              onClick={() => setMobileView('storefront')}
              className={`min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                mobileView === 'storefront'
                  ? 'bg-stone-900 text-white shadow-sm scale-[1.01]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Storefront</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-amber-400 text-stone-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => setMobileView('admin')}
              className={`min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                mobileView === 'admin'
                  ? 'bg-stone-900 text-amber-300 shadow-sm scale-[1.01]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Admin Console</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Live sync banner on mobile */}
        <div className="bg-stone-900 text-stone-300 px-4 py-1 text-[10px] flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Viewing: <strong className="text-white uppercase">{mobileView === 'storefront' ? 'Customer Storefront' : 'Owner Admin'}</strong>
          </span>
          <span className="text-amber-300">
            {activeDiscountCount > 0 ? `⚡ ${activeDiscountCount} sale items active` : 'Standard Pricing'}
          </span>
        </div>
      </div>

      {/* Mobile Content Display (1 view at a time) */}
      <div className="lg:hidden flex-1 pb-16">
        {mobileView === 'storefront' ? (
          <CustomerStorefrontView />
        ) : (
          <AdminDashboard />
        )}
      </div>

      {/* Floating Mobile Toggle Button for fast thumb switching */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() =>
            setMobileView(mobileView === 'storefront' ? 'admin' : 'storefront')
          }
          className="flex items-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-full shadow-2xl border border-amber-500/40 text-xs font-semibold tracking-wider uppercase active:scale-95 transition-transform"
          aria-label="Switch between Storefront and Admin"
        >
          <ArrowLeftRight className="w-4 h-4 text-amber-400" />
          <span>
            {mobileView === 'storefront' ? 'Switch to Admin' : 'Switch to Storefront'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SCREEN INTERFACE (>= lg): Split-Screen Side-by-Side Dual-View     */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col h-screen overflow-hidden">
        {/* Top Desktop Dual-View Command Header */}
        <header className="bg-stone-950 text-stone-200 px-6 py-2 border-b border-stone-800 flex items-center justify-between shrink-0 select-none">
          {/* Brand & Dual View indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm tracking-[0.2em] font-semibold text-white uppercase">
                Classy Tailors
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                [Real-Time Dual-View Architecture]
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time State Sync Active</span>
            </div>
          </div>

          {/* Desktop Layout Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 uppercase tracking-widest font-medium mr-1">
              Desktop View:
            </span>
            <div className="inline-flex bg-stone-900 rounded p-0.5 border border-stone-800">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'split'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Split Screen Layout (Storefront Left | Admin Right)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Split Screen (Side-by-Side)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('storefront')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'storefront'
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Full-width Storefront View"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Storefront Only</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'admin'
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Full-width Admin Dashboard"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Admin Only</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Desktop Body */}
        <div className="flex-1 flex flex-row overflow-hidden relative">
          {/* Left Pane: Customer Storefront */}
          {(viewMode === 'split' || viewMode === 'storefront') && (
            <div
              className={`h-full overflow-y-auto relative bg-white ${
                viewMode === 'split'
                  ? 'w-1/2 border-r border-stone-300'
                  : 'w-full'
              }`}
            >
              <CustomerStorefrontView />
            </div>
          )}

          {/* Right Pane: Owner Admin Dashboard */}
          {(viewMode === 'split' || viewMode === 'admin') && (
            <div
              className={`h-full overflow-y-auto relative bg-[#fbfbfa] ${
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              }`}
            >
              <AdminDashboard />
            </div>
          )}
        </div>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
