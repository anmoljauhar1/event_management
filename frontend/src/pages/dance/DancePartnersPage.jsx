import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getEvents
} from '../../api/events';
import {
  getDancePartners,
  getDancePartnerBookings,
  createDancePartnerBooking
} from '../../api/bookings';
import {
  SparklesIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  XMarkIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const DancePartnersPage = () => {
  const { user } = useAuth();
  
  // State
  const [dancers, setDancers] = useState([]);
  const [events, setEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedDancer, setSelectedDancer] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dancersRes, eventsRes] = await Promise.all([
          getDancePartners(),
          getEvents()
        ]);
        setDancers(dancersRes.data);
        // Show all club party & dj night events as top suggestions, but fall back to all events
        setEvents(eventsRes.data.results || eventsRes.data);
        
        if (user) {
          const bookingsRes = await getDancePartnerBookings();
          setMyBookings(bookingsRes.data);
        }
      } catch (err) {
        console.error('Failed to load Dance Hub data:', err);
        setError('Failed to load page content. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleOpenBooking = (dancer) => {
    setError('');
    setBookingSuccess(false);
    setSelectedDancer(dancer);
    // Auto-select first event if available
    if (events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  };

  const handleCloseBooking = () => {
    setSelectedDancer(null);
    setSelectedEventId('');
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to book a dance partner.');
      return;
    }
    if (!selectedEventId) {
      setError('Please select a club party or event.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      await createDancePartnerBooking({
        partner: selectedDancer.id,
        event: parseInt(selectedEventId)
      });
      
      setBookingSuccess(true);
      // Refresh user's bookings
      const bookingsRes = await getDancePartnerBookings();
      setMyBookings(bookingsRes.data);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleCloseBooking();
        setBookingSuccess(false);
      }, 2500);

    } catch (err) {
      console.error(err);
      setError('Booking failed. You may already have a booking for this dancer at this event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-gray-400 font-medium">Entering Dance Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-500 pb-16">
      
      {/* Dynamic Glowing Background Blobs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            to="/events"
            className="inline-flex items-center text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-all"
          >
            &larr; Back to Discovery desk
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-xl pointer-events-none"></div>
          
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-6">
            <SparklesIcon className="h-4 w-4 mr-1.5 animate-pulse" />
            Club Nights & Live Artists
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            Dance Partner Registry — Book an Artist to Join the Night!
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
            Make your club party, DJ concert, or festive night truly unforgettable. Browse our list of verified professional dancers, book them as companions, and enjoy an amazing rhythm experience on the dance floor!
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#partners-grid"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              Browse Dance Partners &darr;
            </a>
            {myBookings.length > 0 && (
              <a
                href="#my-bookings"
                className="px-6 py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-300 rounded-full font-black text-xs uppercase tracking-wider transition-all border border-slate-800"
              >
                View My Bookings ({myBookings.length})
              </a>
            )}
          </div>
        </div>

        {/* Dance Partners Section */}
        <div id="partners-grid" className="scroll-mt-24 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center">
                <UserGroupIcon className="h-6 w-6 text-indigo-400 mr-2" />
                Verified Professional Dancers
              </h2>
              <p className="text-xs text-slate-400 mt-1">Hire top-rated dance experts to elevate your party experience.</p>
            </div>
            
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>4 Performers Active Tonight</span>
            </div>
          </div>

          {/* Dancers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dancers.map((dancer) => (
              <div
                key={dancer.id}
                className="bg-slate-900/60 backdrop-blur-md overflow-hidden rounded-3xl border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col group"
              >
                {/* Image & Style tag */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={dancer.avatar_url || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300&h=300'}
                    alt={dancer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  
                  <span className="absolute bottom-4 left-4 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-lg">
                    {dancer.style}
                  </span>
                </div>

                {/* Content info block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-extrabold text-white text-lg group-hover:text-indigo-400 transition-colors">
                        {dancer.name}
                      </h3>
                      <div className="flex items-center text-xs font-bold text-amber-400">
                        <StarIconSolid className="h-4 w-4 mr-1" />
                        {dancer.rating}
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                      {dancer.bio}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rate per booking</div>
                      <div className="text-base font-black text-emerald-400 flex items-center">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-0.5" />
                        {dancer.price}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(dancer)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow"
                    >
                      Book Partner to Join &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Bookings List Section */}
        {myBookings.length > 0 && (
          <div id="my-bookings" className="scroll-mt-24 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full mr-2.5 animate-pulse"></span>
              My Active Partner Bookings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl"></div>
                  
                  <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-slate-800/80">
                    <img
                      src={b.partner_details?.avatar_url || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300&h=300'}
                      alt={b.partner_details?.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                    />
                    <div>
                      <h4 className="font-extrabold text-white text-sm">{b.partner_details?.name}</h4>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{b.partner_details?.style}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-slate-400">
                      <CalendarIcon className="h-4 w-4 mr-2 text-slate-500" />
                      <span>{b.event_title}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <MapPinIcon className="h-4 w-4 mr-2 text-slate-500" />
                      <span>{b.event_date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheckIcon className="h-3 w-3 mr-1 animate-pulse" />
                      {b.status}
                    </span>
                    <span className="text-sm font-black text-emerald-400 flex items-center">
                      <CurrencyRupeeIcon className="h-4 w-4 mr-0.5" />
                      {b.partner_details?.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Booking Modal / Drawer overlay */}
      {selectedDancer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
          >
            
            {/* Header info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Partner Booking Desk</span>
                <h3 className="text-xl font-extrabold text-white mt-1">Book {selectedDancer.name}</h3>
              </div>
              <button
                onClick={handleCloseBooking}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-950/30 border border-red-900 text-red-400 rounded-2xl text-xs font-semibold leading-relaxed">
                {error}
              </div>
            )}

            {bookingSuccess ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <span className="text-5xl mb-4 animate-bounce">🎉</span>
                <h4 className="text-lg font-bold text-white">Booking Completed!</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Your dance partner reservation for <strong>{selectedDancer.name}</strong> has been secured! Preparing confirmation stubs...
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-6">
                
                {/* Performer Details summary */}
                <div className="flex items-center space-x-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <img
                    src={selectedDancer.avatar_url}
                    alt={selectedDancer.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shadow-md"
                  />
                  <div>
                    <h4 className="font-extrabold text-white text-base">{selectedDancer.name}</h4>
                    <p className="text-xs text-indigo-400 font-bold">{selectedDancer.style}</p>
                    <div className="flex items-center text-[10px] text-amber-400 mt-1">
                      <StarIconSolid className="h-3 w-3 mr-1" />
                      <span>{selectedDancer.rating} Rating</span>
                    </div>
                  </div>
                </div>

                {/* Party selection dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Select Club Party / Event to Join:
                  </label>
                  {events.length === 0 ? (
                    <p className="text-xs text-rose-400">No active events found. Please create an event first.</p>
                  ) : (
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {events.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title} ({e.date})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Cost summary list */}
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing Overview</div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Dance Partner Fee:</span>
                    <span className="font-bold text-slate-100 flex items-center">
                      <CurrencyRupeeIcon className="h-3.5 w-3.5 mr-0.5 text-slate-500" />
                      {selectedDancer.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Booking Processing Charge:</span>
                    <span className="font-bold text-slate-100 flex items-center">
                      <CurrencyRupeeIcon className="h-3.5 w-3.5 mr-0.5 text-slate-500" />
                      0.00
                    </span>
                  </div>

                  <div className="h-px bg-slate-800/60 my-2"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Total Amount Due:</span>
                    <span className="text-base font-black text-emerald-400 flex items-center">
                      <CurrencyRupeeIcon className="h-4.5 w-4.5 mr-0.5" />
                      {selectedDancer.price}
                    </span>
                  </div>
                </div>

                {/* Bottom submit buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || events.length === 0}
                    className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10"
                  >
                    {submitting ? 'Confirming Booking...' : 'Pay & Confirm Booking'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default DancePartnersPage;
