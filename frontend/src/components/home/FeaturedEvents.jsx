import { useEffect, useState } from 'react';
import { getRecommendations } from '../../api/events';
import EventCard from '../events/EventCard';
import { Link } from 'react-router-dom';

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendations()
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-40 bg-slate-200 rounded col-span-1"></div>
              <div className="h-40 bg-slate-200 rounded col-span-1"></div>
              <div className="h-40 bg-slate-200 rounded col-span-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!events.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Recommended for You
            </h2>
            <p className="mt-3 text-xl text-gray-500">
              Hand-picked events based on your interests.
            </p>
          </div>
          <Link to="/events" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
            View all events &rarr;
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

export default FeaturedEvents;
