import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingDetail, cancelBooking, downloadQR, getCalendarFile } from '../../api/bookings';
import { saveAs } from 'file-saver';
import {
  CalendarIcon,
  MapPinIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchBooking = async () => {
      try {
        const { data } = await getBookingDetail(bookingId);
        if (active) {
          setBooking(data);
        }
      } catch (err) {
        console.error('Fetch booking error:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchBooking();
    return () => {
      active = false;
    };
  }, [bookingId, refreshTrigger]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will restore ticket availability.')) return;
    setCancelling(true);
    try {
      await cancelBooking(booking.booking_id);
      setRefreshTrigger(prev => prev + 1);
    } catch {
      alert('Cancellation failed. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadQR = async () => {
    try {
      const response = await downloadQR(bookingId);
      const blob = new Blob([response.data], { type: 'image/png' });
      saveAs(blob, `ticket_${bookingId}.png`);
    } catch {
      alert('QR ticket download is currently unavailable');
    }
  };

  const handleCalendar = async () => {
    try {
      const response = await getCalendarFile(bookingId);
      const blob = new Blob([response.data], { type: 'text/calendar' });
      saveAs(blob, `event_${bookingId}.ics`);
    } catch {
      alert('Calendar file export is currently unavailable');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Fetching your ticket details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="text-4xl mb-4">🎫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't retrieve the details for this booking.</p>
          <Link to="/bookings" className="inline-block bg-primary hover:bg-primary-600 text-white font-bold px-6 py-2.5 rounded-full transition-all">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const isConfirmed = booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation breadcrumb */}
        <Link to="/bookings" className="inline-flex items-center text-sm font-semibold text-primary-500 dark:text-primary-300 hover:underline mb-6 transition-all">
          &larr; Back to My Bookings
        </Link>

        {/* Master Card container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
          
          {/* Header Banner */}
          <div className={`px-8 py-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
            isConfirmed ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
            isCancelled ? 'bg-gradient-to-r from-rose-500 to-red-600' :
            'bg-gradient-to-r from-amber-500 to-orange-600'
          }`}>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-white/80">Event pass</span>
              <h1 className="text-2xl font-extrabold mt-0.5 tracking-tight">{booking.event_title}</h1>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              {isConfirmed ? (
                <CheckCircleIcon className="h-5 w-5 text-emerald-100 animate-pulse" />
              ) : isCancelled ? (
                <XCircleIcon className="h-5 w-5 text-rose-100" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-amber-100 animate-bounce" />
              )}
              <span className="text-sm font-bold uppercase tracking-wider">{booking.status}</span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Grid Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b dark:border-slate-800 pb-8">
              <div className="flex items-center">
                <CalendarIcon className="h-10 w-10 text-primary-500 mr-3" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Date</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{booking.event_date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPinIcon className="h-10 w-10 text-primary-500 mr-3" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Location</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{booking.event_location || 'Online'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <QrCodeIcon className="h-10 w-10 text-primary-500 mr-3" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Booking ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-800 dark:text-gray-200">{booking.booking_id.slice(0, 8)}...</p>
                </div>
              </div>
            </div>

            {/* Tickets details */}
            <div>
              <h3 className="text-xs uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 mb-4">Ticket details</h3>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-gray-100 dark:border-slate-800/40">
                <ul className="space-y-4 divide-y divide-gray-200/50 dark:divide-slate-800/50">
                  {booking.items?.map((item) => (
                    <li key={item.id} className="flex justify-between items-center pt-3 first:pt-0">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{item.ticket_type.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-extrabold text-primary-600 dark:text-primary-300">₹{item.unit_price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Total Billing */}
                <div className="flex justify-between items-center border-t dark:border-slate-800 pt-4 mt-4 font-black">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Price</span>
                  <span className="text-xl text-primary-600 dark:text-primary-300">₹{booking.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Digital Pass / Actions Board */}
            {isConfirmed && (
              <div className="pt-4 space-y-6">
                
                {/* Ticket Stub Cutout Simulation */}
                <div className="relative flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 border border-dashed border-gray-300 dark:border-slate-800 rounded-3xl">
                  {/* Left Circle cut */}
                  <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-r border-gray-300 dark:border-slate-800"></div>
                  {/* Right Circle cut */}
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-l border-gray-300 dark:border-slate-800"></div>

                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-3">Scan at entrance</p>
                  
                  {booking.qr_code ? (
                    <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100">
                      <img src={booking.qr_code} alt="Ticket QR code" className="h-44 w-44" />
                    </div>
                  ) : (
                    <div className="h-44 w-44 bg-gray-200 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center text-xs text-gray-400 p-4">
                      <span>QR code is generating...</span>
                    </div>
                  )}
                  <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 mt-3 uppercase">EventPro Digital Pass</p>
                </div>

                {/* Confirmations & Exports */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={handleDownloadQR} className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-full font-bold shadow-lg transition-all transform active:scale-98">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Save Ticket PDF
                  </button>
                  <button
                    onClick={handleCalendar}
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary-600/30 text-primary-600 dark:text-primary-300 bg-white hover:bg-primary-10 dark:bg-slate-900 dark:hover:bg-slate-800/40 rounded-full font-bold transition-all transform active:scale-98"
                  >
                    <CalendarDaysIcon className="h-5 w-5 mr-2" />
                    Add to Calendar
                  </button>
                </div>
              </div>
            )}

            {/* Cancel Booking Section */}
            {isConfirmed && (
              <div className="pt-4 border-t dark:border-slate-800 flex justify-center">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 hover:underline transition-colors disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4 mr-1.5" />
                  {cancelling ? 'Cancelling ticket...' : 'Cancel this Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;