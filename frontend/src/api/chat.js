import api from './axios';

export const getChatMessages = (roomId) => api.get(`/chat/${roomId}/messages/`);