import api from './axios';

export const wishlistToggle = (eventId) =>
  api.post(`/wishlist/${eventId}/toggle/`);