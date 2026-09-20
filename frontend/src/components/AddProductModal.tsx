import { useState } from 'react';
import type { FormEvent } from 'react';
import { useBoutique } from '../context';
import { CATEGORIES } from '../data/mockProducts';
import { X, Plus } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useBoutique();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]); // Default to Bespoke Tailoring
  const [basePrice, setBasePrice] = useState<number>(1450);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [fabric, setFabric] = useState('100% Superfine Italian Wool');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name: name.trim(),
      category,
      basePrice: Number(basePrice) || 500,
      discountPercentage: Number(discountPercentage) || 0,
      fabric: fabric.trim() || 'Luxury Textile',
      description:
        description.trim() ||
        'Handcrafted in our atelier with bespoke precision and refined finishing.',
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      inStock: true,
      isFeatured: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-md shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-stone-800" />
            <h3 className="font-serif text-lg font-medium text-stone-900">Add New Luxury Piece</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-stone-700 uppercase tracking-wider font-semibold mb-1">
              Garment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bespoke Vicuña Overcoat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 uppercase tracking-wider font-semibold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-800 bg-white cursor-pointer"
              >
                {CATEGORIES.filter((c) => c !== 'All Collections').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 uppercase tracking-wider font-semibold mb-1">
                Base Price ($ USD) *
              </label>
              <input
                type="number"
                min="10"
                step="10"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 uppercase tracking-wider font-semibold mb-1">
                Initial Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 uppercase tracking-wider font-semibold mb-1">
                Fabric / Material
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Super 160s Wool"
                className="w-full px-3 py-2 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 uppercase tracking-wider font-semibold mb-1">
              Image URL (Unsplash)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-800 text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 uppercase tracking-wider font-semibold mb-1">
              Description & Craftsmanship Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the silhouette, origin, lining, and craftsmanship..."
              className="w-full px-3 py-2 border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-800"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 text-white hover:bg-stone-800 font-medium uppercase tracking-wider rounded shadow-xs"
            >
              Add to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
