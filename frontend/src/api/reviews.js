import api from './axios';

export const getEventReviews = (eventId) => {
  return api.get(`/events/${eventId}/reviews/`);
};

export const createEventReview = (eventId, reviewData) => {
  return api.post(`/events/${eventId}/reviews/`, reviewData);
};
