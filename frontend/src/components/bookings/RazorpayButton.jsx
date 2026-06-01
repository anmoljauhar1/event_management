import { useState } from 'react';
import { createPaymentOrder, verifyPayment } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';

const RazorpayButton = ({ bookingId, bookingType, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const displayRazorpay = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
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
          color: '#4F46E5',
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
      className={`w-full py-3 rounded-lg text-white font-semibold ${
        loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default RazorpayButton;