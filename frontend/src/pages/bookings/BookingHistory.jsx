import { useEffect, useState } from 'react';
import { getBookingHistory } from '../../api/bookings';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  TicketIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getBookingHistory();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your event passes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center">
            <TicketIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2.5" />
            My Booking History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            View all your digital ticket passes, QR tickets, and check booking statuses.
          </p>
        </div>

        {bookings.length === 0 ? (
          /* Premium Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-xl border border-gray-100 dark:border-slate-800 transition-all">
            <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-indigo-600 dark:text-indigo-400">
              🎫
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">No tickets booked yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-8">
              Explore our trending events, webinars, festivals, and secure your slot today!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 duration-200"
            >
              Explore Trending Events
              <SparklesIcon className="h-4.5 w-4.5 ml-1.5" />
            </Link>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-4">
            {bookings.map((b) => {
              const isConfirmed = b.status === 'confirmed';
              const isCancelled = b.status === 'cancelled';
              return (
                <div
                  key={b.id}
                  className="group bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-md hover:shadow-xl border border-gray-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="space-y-2">
                    <Link
                      to={`/bookings/${b.booking_id}`}
                      className="text-lg font-black text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                    >
                      {b.event_title}
                    </Link>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-xs text-gray-400 dark:text-gray-500 font-semibold">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4.5 w-4.5 text-indigo-500 mr-1" />
                        <span>{b.event_date}</span>
                      </div>
                      <div>•</div>
                      <div className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                        Total paid: ₹{b.total_amount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 dark:border-slate-800">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      isConfirmed ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                      isCancelled ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>{b.status}</span>
                    
                    <Link
                      to={`/bookings/${b.booking_id}`}
                      className="inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700/60 dark:text-indigo-300 rounded-full text-xs font-black transition-all"
                    >
                      View Ticket
                      <ChevronRightIcon className="h-3 w-3 ml-1 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;