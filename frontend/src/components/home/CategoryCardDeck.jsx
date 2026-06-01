import { Link } from 'react-router-dom';
import { FunnelIcon } from '@heroicons/react/24/outline';

const CategoryCardDeck = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-12 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
          <FunnelIcon className="h-3.5 w-3.5 mr-1 animate-pulse" />
          Quick Vibe Selector
        </span>
        <h2 className="text-3xl font-black tracking-tight text-white mb-3">
          Visit More Events Like...
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Select a vibe and explore specialized collections of curated local events. Find what you love in one click.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Weddings */}
        <Link
          to="/events?category=marriage"
          className="group relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-amber-900/10 to-slate-900 border border-slate-800/80 hover:border-amber-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div>
            <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300 w-fit">💍</span>
            <h3 className="font-extrabold text-white text-lg mb-1 group-hover:text-amber-400 transition-colors">
              Ceremonies & Weddings
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Marriage setups, traditional mehndi rituals, and festive haldi ceremonies.
            </p>
          </div>
          <div className="mt-8 flex items-center text-[10px] font-bold text-amber-400 group-hover:translate-x-1.5 transition-transform">
            EXPLORE EVENTS &rarr;
          </div>
        </Link>

        {/* Card 2: Clubbing */}
        <Link
          to="/events?category=club_party"
          className="group relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-purple-900/10 to-slate-900 border border-slate-800/80 hover:border-purple-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div>
            <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300 w-fit">🎧</span>
            <h3 className="font-extrabold text-white text-lg mb-1 group-hover:text-purple-400 transition-colors">
              Clubs & DJ Concerts
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              High-energy live acts, modern DJ sets, and exclusive dance club gatherings.
            </p>
          </div>
          <div className="mt-8 flex items-center text-[10px] font-bold text-purple-400 group-hover:translate-x-1.5 transition-transform">
            EXPLORE EVENTS &rarr;
          </div>
        </Link>

        {/* Card 3: Birthdays */}
        <Link
          to="/events?category=birthday"
          className="group relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-cyan-900/10 to-slate-900 border border-slate-800/80 hover:border-cyan-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div>
            <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300 w-fit">🎉</span>
            <h3 className="font-extrabold text-white text-lg mb-1 group-hover:text-cyan-400 transition-colors">
              Parties & Birthdays
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Private birthday bashes, interactive fests, and casual parties.
            </p>
          </div>
          <div className="mt-8 flex items-center text-[10px] font-bold text-cyan-400 group-hover:translate-x-1.5 transition-transform">
            EXPLORE EVENTS &rarr;
          </div>
        </Link>

        {/* Card 4: Webinars */}
        <Link
          to="/events?category=webinar"
          className="group relative overflow-hidden bg-gradient-to-br from-blue-950/40 via-blue-900/10 to-slate-900 border border-slate-800/80 hover:border-blue-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div>
            <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300 w-fit">💻</span>
            <h3 className="font-extrabold text-white text-lg mb-1 group-hover:text-blue-400 transition-colors">
              Webinars & Networks
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Hybrid corporate seminars, tech panels, and online collaborative rooms.
            </p>
          </div>
          <div className="mt-8 flex items-center text-[10px] font-bold text-blue-400 group-hover:translate-x-1.5 transition-transform">
            EXPLORE EVENTS &rarr;
          </div>
        </Link>

      </div>
    </section>
  );
};

export default CategoryCardDeck;
