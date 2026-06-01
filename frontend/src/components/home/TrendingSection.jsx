import { useEffect, useState } from 'react';
import { getTrendingEvents } from '../../api/events';
import EventCard from '../events/EventCard';
import { Link } from 'react-router-dom';

const TrendingSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getTrendingEvents();
        setEvents(data.slice(0, 3)); // Only show top 3 on home
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading || events.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              🔥 Trending Now
            </h2>
            <p className="mt-3 text-xl text-gray-500">
              The most popular events in your community.
            </p>
          </div>
          <Link to="/events/trending" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
            See more trending &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
