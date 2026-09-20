import { useState } from 'react';
import { useBoutique } from '../context';
import { calculateDiscountedPrice } from '../utils/pricing';
import { AddProductModal } from './AddProductModal';
import {
  Percent,
  DollarSign,
  Package,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Sliders,
  History,
  Tag,
  LayoutGrid,
  Table as TableIcon,
  Search,
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    products,
    updateBasePrice,
    updateDiscount,
    applyStorewideDiscount,
    resetAllDiscounts,
    toggleStock,
    deleteProduct,
    resetCatalog,
    activityLogs,
    lastUpdatedProductId,
    activeSaleNotice,
  } = useBoutique();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewFormat, setViewFormat] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [customBulkDiscount, setCustomBulkDiscount] = useState<number>(20);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Filtered products inside admin
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // High-level statistics
  const totalCatalogValue = products.reduce((sum, p) => sum + p.basePrice, 0);
  const discountedCatalogValue = products.reduce(
    (sum, p) => sum + calculateDiscountedPrice(p.basePrice, p.discountPercentage),
    0
  );
  const inStockCount = products.filter((p) => p.inStock).length;
  const discountedCount = products.filter((p) => p.discountPercentage > 0).length;

  return (
    <div className="min-h-full flex flex-col bg-[#fbfbfa] text-stone-900 font-sans selection:bg-stone-800 selection:text-white pb-16">
      {/* Executive Command Header */}
      <div className="bg-stone-900 text-stone-100 px-4 sm:px-6 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20" />
          <div>
            <h1 className="text-xs sm:text-sm font-semibold tracking-wider uppercase font-mono flex items-center gap-2">
              <span>Owner Admin Dashboard</span>
              <span className="text-[10px] text-amber-300 font-normal px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                Live Dual-View
              </span>
            </h1>
            <p className="text-[10px] text-stone-400 hidden sm:block">
              Immediate two-way synchronization with Customer Storefront
            </p>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowActivityLog(!showActivityLog)}
            className={`px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 border ${
              showActivityLog
                ? 'bg-stone-800 text-amber-300 border-amber-600/40'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:text-white'
            }`}
            title="Toggle Live Event Log"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audit Stream</span>
            <span className="text-[9px] px-1 bg-stone-700 rounded-full">{activityLogs.length}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Piece</span>
          </button>
        </div>
      </div>

      {/* Live Activity Audit Drawer (Collapsible) */}
      {showActivityLog && (
        <div className="bg-stone-950 text-stone-300 border-b border-stone-800 px-4 sm:px-6 py-3 max-h-48 overflow-y-auto font-mono text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Real-Time Mutation Audit Log
            </span>
            <button
              onClick={() => setShowActivityLog(false)}
              className="text-stone-400 hover:text-stone-200 text-[10px]"
            >
              Close
            </button>
          </div>
          <div className="space-y-1.5">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between text-[11px] gap-4">
                <span className="text-stone-400 shrink-0">[{log.timestamp}]</span>
                <span
                  className={`flex-1 ${
                    log.type === 'storewide'
                      ? 'text-amber-300 font-medium'
                      : log.type === 'price'
                      ? 'text-emerald-300'
                      : log.type === 'discount'
                      ? 'text-rose-300'
                      : 'text-stone-300'
                  }`}
                >
                  {log.message}
                </span>
                <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 shrink-0">
                  {log.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Executive KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 border border-stone-200 rounded-sm shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Catalog Retail Value</span>
              <DollarSign className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-lg sm:text-xl font-serif font-semibold text-stone-900">
              ${discountedCatalogValue.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-600 mt-1 flex items-center gap-1">
              <span>Original: ${totalCatalogValue.toLocaleString()}</span>
              {totalCatalogValue > discountedCatalogValue && (
                <span className="text-rose-600 font-medium">(-${(totalCatalogValue - discountedCatalogValue).toLocaleString()})</span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 border border-stone-200 rounded-sm shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Active Sale Items</span>
              <Percent className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg sm:text-xl font-serif font-semibold text-stone-900">
              {discountedCount} <span className="text-xs font-normal text-stone-500 font-sans">/ {products.length} items</span>
            </div>
            <div className="text-[10px] text-amber-700 mt-1">
              {activeSaleNotice ? activeSaleNotice : discountedCount > 0 ? 'Individual promotions active' : 'Standard MSRP pricing'}
            </div>
          </div>

          <div className="bg-white p-4 border border-stone-200 rounded-sm shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Inventory In Stock</span>
              <Package className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-lg sm:text-xl font-serif font-semibold text-stone-900">
              {inStockCount} <span className="text-xs font-normal text-stone-500 font-sans">available</span>
            </div>
            <div className="text-[10px] text-stone-600 mt-1">
              {products.length - inStockCount} pieces reserved/out of stock
            </div>
          </div>

          <div className="bg-white p-4 border border-stone-200 rounded-sm shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Storefront Status</span>
              <Sparkles className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-sm font-semibold text-stone-900 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live & Synced</span>
            </div>
            <div className="text-[10px] text-stone-600 mt-1">
              Instant UI reaction on save
            </div>
          </div>
        </div>

        {/* SECTION: Discount Operations & Storewide Controls (CRITICAL REQUIREMENT) */}
        <div className="bg-white border border-stone-200 rounded-sm p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-stone-800" />
                <h2 className="font-serif text-base sm:text-lg font-medium text-stone-900">
                  Global Promotional Operations
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Bulk discount actions propagate immediately to all catalog items and customer shopping bags.
              </p>
            </div>

            {/* CRITICAL: Storewide 20% Off Sale button + Quick presets */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Highlighted Storewide 20% Off Button */}
              <button
                type="button"
                onClick={() => applyStorewideDiscount(20)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded transition-all shadow hover:shadow-md flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>⚡ Storewide 20% Off Sale</span>
              </button>

              {/* 15% VIP Sale */}
              <button
                type="button"
                onClick={() => applyStorewideDiscount(15)}
                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-medium text-xs uppercase tracking-wider rounded transition-colors"
              >
                15% VIP Promo
              </button>

              {/* Clear / Reset All Discounts */}
              <button
                type="button"
                onClick={resetAllDiscounts}
                className="px-3 py-2 border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 font-medium text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3 text-stone-500" />
                <span>Clear All Discounts (0%)</span>
              </button>
            </div>
          </div>

          {/* Custom Bulk Percentage Slider / Input */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-medium text-stone-700 whitespace-nowrap">Custom Bulk Discount:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="5"
                  value={customBulkDiscount}
                  onChange={(e) => setCustomBulkDiscount(Math.max(0, Math.min(90, Number(e.target.value))))}
                  className="w-16 px-2 py-1 border border-stone-300 rounded text-stone-900 font-mono text-center focus:outline-none focus:border-stone-800"
                />
                <span className="font-medium text-stone-500">%</span>
                <button
                  onClick={() => applyStorewideDiscount(customBulkDiscount)}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-medium rounded transition-colors uppercase tracking-wider text-[11px]"
                >
                  Apply to Entire Store
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetCatalog}
                className="text-[11px] text-stone-600 hover:text-stone-800 underline underline-offset-2"
              >
                Reset catalog to default
              </button>
            </div>
          </div>
        </div>

        {/* SECTION: Inventory Control Panel & Price Management */}
        <div className="bg-white border border-stone-200 rounded-sm shadow-xs overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-800" />
                <h2 className="font-serif text-base sm:text-lg font-medium text-stone-900">
                  Inventory & Price Management
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Edit base prices, adjust individual item discounts, and toggle stock availability.
              </p>
            </div>

            {/* Search & View Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter garments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-800 w-44 sm:w-56"
                />
              </div>

              {/* Toggle Table vs Cards */}
              <div className="inline-flex border border-stone-300 rounded bg-stone-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewFormat('table')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewFormat === 'table' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Table view"
                  title="Table layout"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewFormat('cards')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewFormat === 'cards' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Cards view"
                  title="Card list layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Table View (Desktop & Tablet Friendly) */}
          {viewFormat === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-100/70 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Base Price (MSRP)</th>
                    <th className="py-3 px-3">Discount %</th>
                    <th className="py-3 px-3">Live Client Price</th>
                    <th className="py-3 px-3">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs">
                  {filteredProducts.map((product) => {
                    const discounted = calculateDiscountedPrice(
                      product.basePrice,
                      product.discountPercentage
                    );
                    const isUpdated = lastUpdatedProductId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className={`transition-colors duration-300 ${
                          isUpdated
                            ? 'bg-amber-50/80 ring-1 ring-amber-400'
                            : 'hover:bg-stone-50'
                        }`}
                      >
                        {/* Garment Image & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-stone-100 shrink-0 overflow-hidden rounded border border-stone-200">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-serif font-medium text-stone-900 truncate max-w-xs">
                                {product.name}
                              </p>
                              <span className="font-mono text-[10px] text-stone-600 uppercase">
                                ID: {product.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                          {product.category}
                        </td>

                        {/* Editable Base Price */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <span className="text-stone-400 font-mono">$</span>
                            <input
                              type="number"
                              min="0"
                              step="50"
                              value={product.basePrice}
                              onChange={(e) => updateBasePrice(product.id, Number(e.target.value))}
                              className="w-24 px-2 py-1 border border-stone-300 rounded font-mono text-stone-900 font-medium focus:outline-none focus:border-stone-800 bg-white"
                            />
                          </div>
                        </td>

                        {/* Editable Discount Operations */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={product.discountPercentage}
                                onChange={(e) =>
                                  updateDiscount(product.id, Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 border border-stone-300 rounded font-mono text-stone-900 text-center font-medium focus:outline-none focus:border-stone-800 bg-white"
                              />
                              <span className="text-stone-500 font-medium">%</span>
                            </div>

                            {/* Preset Buttons for One-Click Discounting */}
                            <div className="flex items-center gap-1">
                              {[0, 15, 20, 30].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => updateDiscount(product.id, preset)}
                                  className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                                    product.discountPercentage === preset
                                      ? 'bg-stone-900 text-amber-300 border-stone-900 font-bold'
                                      : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                                  }`}
                                >
                                  {preset === 0 ? '0%' : `-${preset}%`}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Calculated Final Price (Real-time Preview) */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {product.discountPercentage > 0 ? (
                            <div>
                              <div className="font-semibold text-stone-900 font-mono text-sm">
                                ${discounted.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-amber-700 font-medium">
                                -${(product.basePrice - discounted).toLocaleString()} ({product.discountPercentage}%)
                              </div>
                            </div>
                          ) : (
                            <div className="font-medium text-stone-800 font-mono text-sm">
                              ${product.basePrice.toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Stock Toggle */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => toggleStock(product.id)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors ${
                              product.inStock
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {product.inStock ? '● In Stock' : '○ Reserved'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Delete Garment"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card View (Mobile & Tablet Layout) */
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const discounted = calculateDiscountedPrice(
                  product.basePrice,
                  product.discountPercentage
                );
                const isUpdated = lastUpdatedProductId === product.id;

                return (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-sm bg-white flex flex-col justify-between transition-all ${
                      isUpdated ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-stone-200'
                    }`}
                  >
                    <div>
                      {/* Top Item Row */}
                      <div className="flex gap-3.5 items-start mb-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-20 object-cover object-top rounded border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-stone-600 font-mono">
                              {product.id}
                            </span>
                            <button
                              onClick={() => toggleStock(product.id)}
                              className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                                product.inStock
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {product.inStock ? 'In Stock' : 'Reserved'}
                            </button>
                          </div>
                          <h3 className="font-serif text-sm font-medium text-stone-900 truncate mt-1">
                            {product.name}
                          </h3>
                          <p className="text-[11px] text-stone-600">{product.category}</p>
                        </div>
                      </div>

                      {/* Price & Discount Edit Inputs */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                            Base Price ($)
                          </label>
                          <div className="flex items-center">
                            <span className="text-stone-400 mr-1 font-mono">$</span>
                            <input
                              type="number"
                              min="0"
                              step="50"
                              value={product.basePrice}
                              onChange={(e) => updateBasePrice(product.id, Number(e.target.value))}
                              className="w-full px-2 py-1.5 border border-stone-300 rounded font-mono text-stone-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
                            Discount (%)
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={product.discountPercentage}
                              onChange={(e) =>
                                updateDiscount(product.id, Number(e.target.value))
                              }
                              className="w-full px-2 py-1.5 border border-stone-300 rounded font-mono text-stone-900"
                            />
                            <span className="text-stone-500 ml-1">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Discount Presets */}
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="text-[10px] text-stone-600 uppercase font-medium mr-1">Quick:</span>
                        {[0, 10, 20, 30, 50].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateDiscount(product.id, preset)}
                            className={`px-2 py-0.5 text-[10px] rounded border ${
                              product.discountPercentage === preset
                                ? 'bg-stone-900 text-amber-300 border-stone-900 font-bold'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Final Calculated Price & Delete */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-600 block">
                          Client Price
                        </span>
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="font-semibold text-stone-900 text-sm">
                            ${discounted.toLocaleString()}
                          </span>
                          {product.discountPercentage > 0 && (
                            <span className="text-[11px] text-stone-600 line-through">
                              ${product.basePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
