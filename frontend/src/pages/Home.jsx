import Hero from '../components/home/Hero';
import FeaturedEvents from '../components/home/FeaturedEvents';
import TrendingSection from '../components/home/TrendingSection';
import CategoryCardDeck from '../components/home/CategoryCardDeck';
import EventCollections from '../components/home/EventCollections';
import { SparklesIcon, CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const isHost = user && user.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Section */}
      <Hero />


      {/* Visual Category Card Selector Deck (First major exploratory element) */}
      <div className="bg-slate-950 transition-colors duration-500 pt-4">
        <CategoryCardDeck />
      </div>

      {/* Featured/Recommended Section */}
      <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
        <FeaturedEvents />
      </div>

      {/* Trending Section */}
      <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <TrendingSection />
      </div>

      {/* Specialized Event Collections (Clubs, Parties, Family Weddings) */}
      <div className="bg-slate-950 transition-colors duration-500 pt-8">
        <EventCollections />
      </div>

      {/* Dance & Club Night Promo Hub */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                🔥 Hot New Feature
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Introducing the Club Night & Dance Hub!
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Planning to join a high-energy DJ party, college fest, or wedding dance? You can now browse verified professional dance partners and performers directly on EventPro! Select your dancer, book a ticket for them to join, and let the professionals make your night truly unforgettable.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/dance-partners"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-indigo-500/10"
                >
                  Explore Dance Partners 🕺
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-br from-indigo-950 to-purple-950 p-1 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600&h=400"
                  alt="Club Night & Dance partners promo representation"
                  className="w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950">
        {/* Abstract shapes overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-indigo-300 border border-white/10">
            <SparklesIcon className="h-4 w-4 mr-1.5 animate-spin" />
            {isHost ? 'Empower your community' : 'Discover elite parties & ceremonies'}
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            {isHost ? (
              <>
                Ready to host your next <span className="text-indigo-400 bg-clip-text">incredible event?</span>
              </>
            ) : (
              <>
                Explore local <span className="text-indigo-400 bg-clip-text">parties & ceremonies!</span>
              </>
            )}
          </h2>

          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {isHost ? (
              'Create an event in seconds. Sell secure QR tickets, chat with your guests in real-time, and manage everything from a premium dashboard.'
            ) : (
              'Discover Marriage Halls, high-energy DJ dance parties, custom ceremonies, haldi, mehndi, and college fests near you. Explore and visit today!'
            )}
          </p>

          <div className="pt-6">
            {isHost ? (
              <Link
                to="/events/create"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 duration-200"
              >
                Create an Event
              </Link>
            ) : (
              <Link
                to="/events"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 duration-200"
              >
                Explore Events Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats/Features Section (Optional but good for premium feel) */}
      <section className="relative py-16 overflow-hidden">
        {/* Background glow decorator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20 dark:opacity-10 blur-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

            {/* Stat Card 1 */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start space-x-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <CalendarDaysIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">1,000+</div>
                <div className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-black">Events Hosted</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">Webinars, Haldi ceremonies, DJ Nights, and wedding receptions managed flawlessly.</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start space-x-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <MapPinIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">50+</div>
                <div className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-black">Verified Venues</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">Spacious marriage halls, pool parties, club lounges, and hybrid dynamic spaces.</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start space-x-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">10k+</div>
                <div className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-black">Happy Attendees</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">Enjoying real-time chats, ticket QR scanners, and instant booking processes.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;