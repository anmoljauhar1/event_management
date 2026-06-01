import { useEffect, useState } from 'react';
import { getTrendingEvents } from '../../api/events';
import EventCard from '../../components/events/EventCard';

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getTrendingEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleLikeChange = (id) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? { ...ev, is_liked: !ev.is_liked, likes_count: ev.is_liked ? ev.likes_count - 1 : ev.likes_count + 1 }
          : ev
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔥 Trending Events</h1>
      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No trending events at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onLikeChange={handleLikeChange} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingEvents;