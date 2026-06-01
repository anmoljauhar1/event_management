import { Link } from 'react-router-dom';
import { HeartIcon as OutlineHeart } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { likeEvent } from '../../api/events';
import { useAuth } from '../../context/AuthContext';

const EventCard = ({ event, onLikeChange }) => {
  const { user } = useAuth();

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await likeEvent(event.id);
      if (onLikeChange) {
        onLikeChange(event.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <Link to={`/events/${event.id}`} className="flex-grow">
        <div className="h-52 bg-gray-200 relative overflow-hidden">
          {event.first_image ? (
            <img
              src={event.first_image}
              alt={event.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-sm font-medium">No Image Available</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {user && (
            <button
              onClick={handleLike}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110 z-10"
            >
              {event.is_liked ? (
                <SolidHeart className="h-5 w-5 text-red-500" />
              ) : (
                <OutlineHeart className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}
          
          <div className="absolute bottom-3 left-3 flex gap-2">
             <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-600 text-white px-2 py-1 rounded-md shadow-sm">
                {event.category}
              </span>
              {event.is_private && (
                <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-100 px-2 py-1 rounded-md shadow-sm border border-slate-700">
                  🔒 Private
                </span>
              )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <CalendarIcon className="h-4 w-4 mr-2 text-indigo-500" />
              <span>{event.date} • {event.time}</span>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <MapPinIcon className="h-4 w-4 mr-2 text-indigo-500" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <UserGroupIcon className="h-4 w-4 mr-2 text-indigo-500" />
              <span>{event.likes_count} people interested</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-5 py-4 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <span className="text-indigo-600 font-bold">
          {event.price > 0 ? `$${event.price}` : 'Free'}
        </span>
        <Link 
          to={`/events/${event.id}`} 
          className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
        >
          Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default EventCard;