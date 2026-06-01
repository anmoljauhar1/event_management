import api from './axios';

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await api.post('/auth/logout/', { refresh: refreshToken });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

export const updateProfile = async (formData) => {
  // formData should contain all fields, including file if needed
  // Use multipart/form-data
  const response = await api.patch('/auth/profile/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};