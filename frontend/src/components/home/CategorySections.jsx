import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../api/events';
import EventCard from '../events/EventCard';
import { useAuth } from '../../context/AuthContext';
import {
  SparklesIcon,
  CakeIcon,
  HeartIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// EmptySection declared at module scope to avoid creating components during render
const EmptySection = ({ title, category, isHost }) => (
  <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center backdrop-blur-md">
    <p className="text-slate-400 text-sm mb-4">No upcoming {title} events listed yet.</p>
    {isHost ? (
      <Link
        to={`/events/create?category=${category}`}
        className="inline-flex items-center text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        Host the first {title} Event &rarr;
      </Link>
    ) : (
      <Link
        to={`/events?category=${category}`}
        className="inline-flex items-center text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
      >
        Explore {title} Events &rarr;
      </Link>
    )}
  </div>
);

const CategorySections = () => {
  const { user } = useAuth();
  const isHost = user?.role === 'admin';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getEvents();
        // Django api might return paganated data (results) or direct list
        setEvents(data.results || data);
      } catch (err) {
        console.error('Failed to fetch events for sections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

// EmptySection moved out of component to avoid creating components during render
const EmptySection = ({ title, category, isHost }) => (
  <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center backdrop-blur-md">
    <p className="text-slate-400 text-sm mb-4">No upcoming {title} events listed yet.</p>
    {isHost ? (
      <Link
        to={`/events/create?category=${category}`}
        className="inline-flex items-center text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        Host the first {title} Event &rarr;
      </Link>
    ) : (
      <Link
        to={`/events?category=${category}`}
        className="inline-flex items-center text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
      >
        Explore {title} Events &rarr;
      </Link>
    )}
  </div>
);

  // Filter events into distinct categories
  const clubEvents = events.filter((ev) =>
    ['club_party', 'dj_night', 'dance_club'].includes(ev.category)
  ).slice(0, 3); // show top 3

  const partyEvents = events.filter((ev) =>
    ['birthday', 'college_fest'].includes(ev.category)
  ).slice(0, 3); // show top 3

  const functionEvents = events.filter((ev) =>
    ['marriage', 'haldi', 'mehndi'].includes(ev.category)
  ).slice(0, 3); // show top 3

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-800 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-48 bg-slate-800 rounded-3xl"></div>
            <div className="h-48 bg-slate-800 rounded-3xl"></div>
            <div className="h-48 bg-slate-800 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="space-y-24 pb-16 bg-slate-950 text-slate-100">
      
      {/* 1. CLUB & NIGHTLIFE SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow backing */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-900/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center tracking-tight">
              <MusicalNoteIcon className="h-7 w-7 text-purple-400 mr-2.5" />
              Club Parties & Nightlife
            </h2>
            <p className="text-xs text-slate-400 mt-1">High-energy concerts, live sets, DJ nights, and exclusive dance club gatherings.</p>
          </div>
          <Link
            to="/events?category=club_party"
            className="text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center self-start sm:self-auto"
          >
            Visit All Club Events <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {clubEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clubEvents.map((event) => (
              <div key={event.id} className="transform hover:-translate-y-1 transition-all duration-300">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <EmptySection title="Club & DJ Night" category="club_party" isHost={isHost} />
        )}
      </section>

      {/* 2. PARTIES & CELEBRATIONS SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-indigo-900/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center tracking-tight">
              <CakeIcon className="h-7 w-7 text-indigo-400 mr-2.5" />
              Birthday Parties & Fests
            </h2>
            <p className="text-xs text-slate-400 mt-1">Dynamic college fests, private birthday bashes, and community get-togethers.</p>
          </div>
          <Link
            to="/events?category=birthday"
            className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center self-start sm:self-auto"
          >
            Visit All Celebrations <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {partyEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partyEvents.map((event) => (
              <div key={event.id} className="transform hover:-translate-y-1 transition-all duration-300">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <EmptySection title="Birthday & Festival" category="birthday" isHost={isHost} />
        )}
      </section>

      {/* 3. WEDDING & FUNCTION SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-amber-900/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center tracking-tight">
              <HeartIcon className="h-7 w-7 text-amber-400 mr-2.5" />
              Weddings & Family Functions
            </h2>
            <p className="text-xs text-slate-400 mt-1">Royal marriages, traditional haldi setup, mehndi ceremonies, and banquet receptions.</p>
          </div>
          <Link
            to="/events?category=marriage"
            className="text-xs font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors flex items-center self-start sm:self-auto"
          >
            Visit All Wedding Functions <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {functionEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {functionEvents.map((event) => (
              <div key={event.id} className="transform hover:-translate-y-1 transition-all duration-300">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <EmptySection title="Wedding ceremony" category="marriage" isHost={isHost} />
        )}
      </section>

      {/* 4. "EXPLORE MORE CATEGORIES" VISUAL DECK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
            <FunnelIcon className="h-3.5 w-3.5 mr-1" />
            Discover events by type
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white mb-3">
            Visit More Events Like...
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Browse specialized collections of curated local events. Find the exact vibe you are looking for in just one click.
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

    </div>
  );
};

export default CategorySections;
