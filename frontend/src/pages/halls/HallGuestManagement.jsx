import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHallDetail } from '../../api/halls';

const HallGuestManagement = () => {
  const { hallId } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guests, setGuests] = useState([]);
  const [guestForm, setGuestForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
  });

  useEffect(() => {
    fetchHall();
  }, [hallId]);

  const fetchHall = async () => {
    try {
      setLoading(true);
      const { data } = await getHallDetail(hallId);
      setHall(data);
      // TODO: Fetch guests from backend when endpoint is available
    } catch (err) {
      console.error('Error fetching hall:', err);
      setError('Failed to load hall details');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestForm({ ...guestForm, [name]: value });
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    // TODO: Implement guest addition when backend API is ready
    alert('Guest management feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
          <button
            onClick={() => navigate('/halls/manage')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to My Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/halls/manage')}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          ← Back to My Venues
        </button>

        {hall && (
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Guest Management - {hall.name}</h1>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Venue Details</h2>
              <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Guest</h2>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    name="guest_name"
                    value={guestForm.guest_name}
                    onChange={handleGuestInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Email
                  </label>
                  <input
                    type="email"
                    name="guest_email"
                    value={guestForm.guest_email}
                    onChange={handleGuestInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Phone
                  </label>
                  <input
                    type="tel"
                    name="guest_phone"
                    value={guestForm.guest_phone}
                    onChange={handleGuestInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Guest
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Invited Guests</h2>
              {guests.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
                  No guests invited yet. Add your first guest above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr key={guest.id}>
                          <td className="border border-gray-300 px-4 py-2">{guest.guest_name}</td>
                          <td className="border border-gray-300 px-4 py-2">{guest.guest_email}</td>
                          <td className="border border-gray-300 px-4 py-2">{guest.guest_phone}</td>
                          <td className="border border-gray-300 px-4 py-2 capitalize">{guest.status}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <button className="text-red-600 hover:text-red-800">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallGuestManagement;
