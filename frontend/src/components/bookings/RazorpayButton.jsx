import { useState } from 'react';
import { createPaymentOrder, verifyPayment } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';

const RazorpayButton = ({ bookingId, bookingType, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const displayRazorpay = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#1B2E7C';
    try {
      const { data: orderData } = await createPaymentOrder({
        booking_id: bookingId,
        type: bookingType,
        amount: amount.toString(),
      });

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EventPro',
        description: bookingType === 'event' ? 'Event Ticket Booking' : 'Hall Booking',
        order_id: orderData.order_id,
        handler: async function (response) {
          // Verify payment
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess();
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.user?.first_name + ' ' + user?.user?.last_name || 'User',
          email: user?.user?.email || '',
        },
        theme: {
          color: themeColor,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={displayRazorpay}
      disabled={loading}
      className={`w-full py-3 rounded-xl font-semibold ${loading ? 'text-muted cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'}`}
      style={{
        transition: 'all 220ms ease',
        backgroundColor: loading ? 'rgba(255,255,255,0.14)' : undefined,
      }}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default RazorpayButton;