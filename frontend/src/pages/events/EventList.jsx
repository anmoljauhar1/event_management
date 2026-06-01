import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getEvents } from '../../api/events';
import EventCard from '../../components/events/EventCard';
import EventFilters from '../../components/events/EventFilters';
import { useAuth } from '../../context/AuthContext';

const EventList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Read filters from searchParams
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const date_from = searchParams.get('date_from') || '';
  const date_to = searchParams.get('date_to') || '';
  const location = searchParams.get('location') || '';

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (date_from) params.date_from = date_from;
      if (date_to) params.date_to = date_to;
      if (location) params.location = location;
      const { data } = await getEvents(params);
      setEvents(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, date_from, date_to, location]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (newFilters) => {
    const updatedParams = {};
    if (newFilters.search) updatedParams.search = newFilters.search;
    if (newFilters.category) updatedParams.category = newFilters.category;
    if (newFilters.date_from) updatedParams.date_from = newFilters.date_from;
    if (newFilters.date_to) updatedParams.date_to = newFilters.date_to;
    if (newFilters.location) updatedParams.location = newFilters.location;
    setSearchParams(updatedParams);
  };

  // Update is_liked after like toggle (without full refetch)
  const handleLikeChange = (eventId) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, is_liked: !ev.is_liked, likes_count: ev.is_liked ? ev.likes_count - 1 : ev.likes_count + 1 }
          : ev
      )
    );
  };

  const initialFilters = { search, category, date_from, date_to, location };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        {user?.role === 'admin' && (
          <Link to="/events/create" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Create Event
          </Link>
        )}
      </div>
      <EventFilters onFilter={handleFilterChange} initialFilters={initialFilters} />
      {loading ? (
        <div className="text-center py-10">Loading events...</div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onLikeChange={handleLikeChange} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No events found.</div>
      )}
    </div>
  );
};

export default EventList;