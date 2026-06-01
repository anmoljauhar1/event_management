import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventDetail } from '../../api/events';
import { useAuth } from '../../context/AuthContext';
import { getTicketTypes, createBooking } from '../../api/bookings';
import TicketTypeSelector from '../../components/bookings/TicketTypeSelector';
import RazorpayButton from '../../components/bookings/RazorpayButton';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const EventBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [booking, setBooking] = useState(null); // holds created booking data
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (booking && booking.status === 'confirmed') {
      navigate(`/bookings/${booking.booking_id}`);
    }
  }, [booking, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, ticketsRes] = await Promise.all([
          getEventDetail(id),
          getTicketTypes(id),
        ]);
        setEvent(eventRes.data);
        setTicketTypes(ticketsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBook = async (items) => {
    setBookingError('');
    try {
      const { data } = await createBooking({ event: id, items });
      setBooking(data);
    } catch (err) {
      setBookingError(err.response?.data?.detail || 'Failed to create booking. Please try again.');
    }
  };

  const handlePaymentSuccess = () => {
    // After successful payment, redirect to booking detail
    navigate(`/bookings/${booking.booking_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Preparing booking desk...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The event booking desk could not be retrieved.</p>
          <Link to="/events" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-full transition-all">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // If booking is created and total is 0 (free), redirect automatically
  if (booking && booking.status === 'confirmed') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-6 transition-all"
        >
          &larr; Back to event overview
        </Link>

        {/* Master columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left info box (1/3 column) */}
          <div className="space-y-6">
            
            {/* Event Summary Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-800 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Booking Desk
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                {event.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                {event.description}
              </p>
              
              <div className="space-y-3 pt-4 border-t dark:border-slate-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <CalendarIcon className="h-4.5 w-4.5 text-indigo-500 mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4.5 w-4.5 text-indigo-500 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4.5 w-4.5 text-indigo-500 mr-2" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <TicketIcon className="h-4.5 w-4.5 text-indigo-500 mr-2" />
                  <span className="truncate font-bold">{event.price && parseFloat(event.price) > 0 ? `₹${event.price}` : 'Free'}</span>
                </div>
              </div>
            </div>

            {/* Security Proof Card */}
            <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl p-5 border border-indigo-100/50 dark:border-slate-900/60 flex items-start">
              <ShieldCheckIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">Secure Booking</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">
                  Your ticket bookings are secure. We offer guaranteed seats and live ticket QR check-ins.
                </p>
              </div>
            </div>

          </div>

          {/* Right form box (2/3 column) */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-800 transition-all duration-300">
              
              {bookingError && (
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-semibold border border-rose-100 dark:border-rose-900/30 flex items-start">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {!booking ? (
                /* STEP 1: Select tickets */
                ticketTypes.length > 0 ? (
                  <TicketTypeSelector ticketTypes={ticketTypes} onProceed={handleBook} />
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <span className="text-4xl">🎫</span>
                    <p className="font-bold text-gray-700 dark:text-gray-300 mt-2">No tickets registered</p>
                    <p className="text-xs text-gray-400 mt-1">Tickets are not available yet for this event.</p>

                    {event?.is_owner ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">You are the organizer — add ticket types to accept bookings.</p>
                        <Link
                          to={`/events/${id}/edit`}
                          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700"
                        >
                          Manage Ticket Types
                        </Link>
                      </div>
                    ) : user ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Message the host to request ticket availability.</p>
                        <Link
                          to={`/events/${id}`}
                          className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-semibold text-sm hover:bg-indigo-100"
                        >
                          Message Organizer
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Log in to contact the organizer about tickets.</p>
                        <Link
                          to="/login"
                          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700"
                        >
                          Log in to Contact
                        </Link>
                      </div>
                    )}
                  </div>
                )
              ) : (
                /* STEP 2: Checkout & payment */
                booking.total_amount > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center">
                        <TicketIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        Final Checkout Payment
                      </h3>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Step 2 of 2
                      </span>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800/40">
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-3">Order Invoice Summary</p>
                      
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex justify-between">
                          <span>Booking Ref ID</span>
                          <span className="font-mono">{booking.booking_id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between font-bold border-t dark:border-slate-800 pt-3 mt-3 text-base text-indigo-600 dark:text-indigo-400">
                          <span>Total Payment Due</span>
                          <span>₹{booking.total_amount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <RazorpayButton
                        bookingId={booking.booking_id}
                        bookingType="event"
                        amount={booking.total_amount}
                        onSuccess={handlePaymentSuccess}
                      />
                      <p className="text-[10px] text-gray-400 text-center mt-3 leading-normal">
                        By clicking "Pay Now" you agree to allow us to secure your bookings. Refunds are subject to organizer guidelines.
                      </p>
                    </div>
                  </div>
                ) : null
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EventBookingPage;