import api from './axios';

export const getEvents = (params) => {
  return api.get('/events/', { params });
};

export const getTrendingEvents = () => {
  return api.get('/events/trending/');
};

export const getEventDetail = (id) => {
  return api.get(`/events/${id}/`);
};

export const createEvent = (eventData) => {
  return api.post('/events/', eventData);
};

export const updateEvent = (id, eventData) => {
  return api.patch(`/events/${id}/`, eventData);
};

export const deleteEvent = (id) => {
  return api.delete(`/events/${id}/`);
};

export const likeEvent = (id) => {
  return api.post(`/events/${id}/like/`);
};

export const uploadEventImages = (id, formData) => {
  return api.post(`/events/${id}/upload_images/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteEventImage = (eventId, imageId) => {
  return api.delete(`/events/${eventId}/images/${imageId}/`);
};

export const getRecommendations = () => {
  return api.get('/events/recommendations/');
};