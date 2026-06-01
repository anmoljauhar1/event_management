import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { createEvent, updateEvent, getEventDetail } from '../../api/events';
import { CATEGORIES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const EventCreateEdit = () => {
  const { id } = useParams(); // if id exists, it's edit mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const { user, loading: authLoading } = useAuth();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categoryParam,
    date: '',
    time: '',
    location: '',
    address: '',
    is_private: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // wait until auth finishes loading before enforcing role redirect
    if (!authLoading && user && user.role !== 'admin') {
      navigate('/events');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const { data } = await getEventDetail(id);
          // Check ownership (optional, but backend will enforce)
          if (!data.is_owner) {
            navigate('/events');
            return;
          }
          setForm({
            title: data.title,
            description: data.description,
            category: data.category,
            date: data.date,
            time: data.time,
            location: data.location,
            address: data.address || '',
            is_private: data.is_private || false,
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit, navigate]);

  // Sync category parameter if set
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateEvent(id, form);
        navigate(`/events/${id}`);
      } else {
        const { data } = await createEvent(form);
        navigate(`/events/${data.id}`);
      }
    } catch (err) {
      console.error('Event create/update failed:', err);
      // Handle common auth/permission cases explicitly
      const status = err.response?.status;
      const detail = err.response?.data?.detail || err.response?.data || '';

      if (status === 401) {
        // Not authenticated
        setError('You must be signed in to host events. Please log in.');
        // Redirect to login so user can re-authenticate
        navigate('/login');
      } else if (status === 403 || (typeof detail === 'string' && detail.toLowerCase().includes('only event hosts'))) {
        setError('Only Event Hosts can create events. Ask an admin to upgrade your account or contact support.');
      } else if (status === 400) {
        // show validation details if provided
        setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
      } else {
        // Generic error — include message when available to aid debugging in dev
        setError(err.response?.data?.detail || err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 relative overflow-hidden">
      {/* Background glow decorators */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Navigation back link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-all mb-8"
        >
          &larr; Go Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent tracking-tight">
            {isEdit ? 'Refine Your Event Detail' : 'Host a Brand New Event'}
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Fill in the particulars below to make your gathering public or private in seconds.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900 text-red-400 rounded-2xl text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Event Title</label>
            <input
              name="title"
              required
              placeholder="e.g. Neon Horizon DJ Party"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Event Description</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Provide a detailed agenda, instructions, and highlight terms..."
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none leading-relaxed"
            />
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Event Category</label>
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="" className="text-slate-600">Select vibe category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-slate-950 text-white font-medium">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
              <input
                type="date"
                name="date"
                required
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Time</label>
              <input
                type="time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Location Name</label>
            <input
              name="location"
              required
              placeholder="e.g. Hyatt Regency Ballroom"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Street Address (Optional)</label>
            <input
              name="address"
              placeholder="e.g. 102 Regency Court Drive, Block-B"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Securing Event Server...' : isEdit ? 'Update Details' : 'Host Event Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventCreateEdit;