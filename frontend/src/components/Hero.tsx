import { ArrowRight, Award, Compass, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero = ({ onExploreClick }: HeroProps) => {
  return (
    <section className="relative bg-[#faf9f5] border-b border-stone-200 overflow-hidden">
      {/* Subtle Background Pattern / Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-300 bg-white/80 shadow-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-stone-700" />
            <span className="text-[11px] font-medium tracking-[0.25em] text-stone-600 uppercase">
              Autumn / Winter 2026 Atelier
            </span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight leading-[1.15] mb-4">
            Bespoke Elegance, <br />
            <span className="italic font-light text-stone-700">Artisanal Mastery.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-stone-600 font-sans font-light leading-relaxed max-w-lg mb-8">
            Sculpted silhouettes, Italian cashmeres, and meticulously hand-stitched 
            canvasses tailored for discerning collectors and icons of style.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium tracking-widest uppercase transition-all duration-200 shadow-sm group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#atelier-notes"
              onClick={(e) => {
                e.preventDefault();
                onExploreClick();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-stone-300 bg-white text-stone-800 hover:border-stone-900 text-xs font-medium tracking-widest uppercase transition-colors"
            >
              Private Salon Fitting
            </a>
          </div>

          {/* Atelier Pillars */}
          <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left w-full">
            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-stone-900">Savile Row Heritage</p>
                <p className="text-[11px] text-stone-600 mt-0.5">Hand-basted canvas</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-stone-900">Global White-Glove</p>
                <p className="text-[11px] text-stone-600 mt-0.5">Discreet express delivery</p>
              </div>
            </div>
            <div className="hidden sm:flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-stone-900">Real-Time Atelier Sync</p>
                <p className="text-[11px] text-stone-600 mt-0.5">Direct runway-to-salon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
