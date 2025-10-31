
import { apiClient } from '@/lib/api';

export const getNotifications = async () => {
  // return apiClient.get('/notifications');
  return Promise.resolve([]);
};

export const markNotificationAsRead = async (id: string) => {
  // return apiClient.post(`/notifications/${id}/read`);
  return Promise.resolve();
};

export const markAllNotificationsAsRead = async () => {
  // return apiClient.post('/notifications/read-all');
  return Promise.resolve();
};
