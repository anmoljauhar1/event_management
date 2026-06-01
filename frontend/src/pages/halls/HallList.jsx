import { useEffect, useState } from 'react';
import { getHalls } from '../../api/halls';  
import { Link } from 'react-router-dom';

const HallList = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHalls()
      .then(res => setHalls(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading venues...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Available Venues</h1>
        <p className="text-gray-600 mt-2">Discover amazing halls for your events</p>
      </div>

      {halls.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No venues available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map(hall => (
            <div key={hall.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Hall Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                {hall.image ? (
                  <img src={hall.image} alt={hall.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-bold text-indigo-600 shadow-lg">
                  {hall.category}
                </div>
              </div>

              {/* Hall Details */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{hall.name}</h2>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{hall.location}</span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    </svg>
                    {hall.category}
                  </div>

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capacity: {hall.capacity}
                  </div>

                  <div className="flex items-center pt-2 border-t border-gray-200 font-bold text-lg text-indigo-600">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.16 5a.5.5 0 00-.5.5c0 1.384-.564 2.646-1.477 3.553-.913.907-2.169 1.447-3.553 1.447A.5.5 0 002 10a8 8 0 0016 0 .5.5 0 00-.5-.5c-1.384 0-2.64-.54-3.553-1.447C9.715 7.646 9.16 6.384 9.16 5a.5.5 0 00-.5-.5h-1.5a.5.5 0 00-.5.5v.5c0 1.156.372 2.227 1 3.1A5.995 5.995 0 008.16 5z" />
                    </svg>
                    ₹{parseFloat(hall.price_per_day).toFixed(2)}/day
                  </div>
                </div>

                {hall.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hall.description}</p>
                )}

                {hall.amenities && (
                  <div className="mb-4 text-xs">
                    <p className="font-semibold text-gray-700 mb-1">Amenities:</p>
                    <p className="text-gray-600 line-clamp-1">{hall.amenities}</p>
                  </div>
                )}

                <Link 
                  to={`/halls/${hall.id}/book`} 
                  className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Book Tickets
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HallList;