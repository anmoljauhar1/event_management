import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHalls, deleteHall } from '../../api/halls';
import { useAuth } from '../../context/AuthContext';

const HallManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const { data } = await getHalls();
      // Filter to show only halls owned by the current user
      const userHalls = data.results ? data.results.filter(h => h.owner === user?.id) : data.filter(h => h.owner === user?.id);
      setHalls(userHalls);
    } catch (err) {
      console.error('Error fetching halls:', err);
      setError('Failed to load halls');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hallId) => {
    if (!window.confirm('Are you sure you want to delete this hall?')) return;

    try {
      await deleteHall(hallId);
      setHalls(halls.filter(h => h.id !== hallId));
    } catch (err) {
      console.error('Error deleting hall:', err);
      setError('Failed to delete hall');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Venues</h1>
          <button
            onClick={() => navigate('/halls/create')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Create New Venue
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {halls.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">You haven't created any venues yet.</p>
            <button
              onClick={() => navigate('/halls/create')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Your First Venue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {halls.map((hall) => (
              <div key={hall.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{hall.name}</h2>
                    <p className="text-gray-600 mb-4">{hall.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-semibold capitalize">{hall.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold">{hall.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-semibold">{hall.capacity} guests</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price/Day</p>
                        <p className="font-semibold">${parseFloat(hall.price_per_day).toFixed(2)}</p>
                      </div>
                    </div>
                    {hall.amenities && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Amenities</p>
                        <p className="text-sm text-gray-700">{hall.amenities}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => navigate(`/halls/${hall.id}/manage`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Manage Guests
                  </button>
                  <button
                    onClick={() => navigate(`/halls/${hall.id}/edit`)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hall.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallManagement;
