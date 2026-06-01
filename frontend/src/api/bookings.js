import api from './axios';

export const getTicketTypes = (eventId) => api.get(`/events/${eventId}/ticket-types/`);

export const createBooking = (data) => api.post('/bookings/create/', data);

export const getBookingHistory = () => api.get('/bookings/history/');

export const getBookingDetail = (bookingId) => api.get(`/bookings/${bookingId}/`);

export const cancelBooking = (bookingId, reason = '') => api.patch(`/bookings/${bookingId}/cancel/`, { reason });

export const downloadQR = (bookingId) => api.get(`/bookings/${bookingId}/qr/`, { responseType: 'blob' });

export const getCalendarFile = (bookingId) => api.get(`/bookings/${bookingId}/calendar/`, { responseType: 'blob' });

// Payment
export const createPaymentOrder = (data) => api.post('/payment/create-order/', data);

export const verifyPayment = (data) => api.post('/payment/verify/', data);


export const getHalls = () => api.get('/halls/');
export const getHallDetail = (id) => api.get(`/halls/${id}/`);
export const createHallBooking = (data) => api.post('/hall-bookings/create/', data);

// Dance Partners & Bookings
export const getDancePartners = () => api.get('/dance-partners/');
export const getDancePartnerBookings = () => api.get('/dance-partners/bookings/');
export const createDancePartnerBooking = (data) => api.post('/dance-partners/bookings/', data);