import api from './axios';

export const getHalls = (params) => {
  return api.get('/halls/', { params });
};

export const getHallDetail = (id) => {
  return api.get(`/halls/${id}/`);
};

export const createHall = (hallData) => {
  return api.post('/halls/', hallData);
};

export const updateHall = (id, hallData) => {
  return api.patch(`/halls/${id}/`, hallData);
};

export const deleteHall = (id) => {
  return api.delete(`/halls/${id}/`);
};

export const createHallBooking = (bookingData) => {
  return api.post('/hall-bookings/create/', bookingData);
};

export const getVenues = (params) => {
  return api.get('/venues/', { params });
};
