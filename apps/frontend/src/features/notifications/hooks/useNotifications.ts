
import { useState, useEffect } from 'react';
import { socket } from '@/services/socket';

const mockNotifications = [
  { id: 1, message: 'Your order has shipped!', timestamp: '2 minutes ago', read: false, type: 'order' },
  { id: 2, message: 'New feature available: Dark Mode.', timestamp: '1 hour ago', read: false, type: 'announcement' },
  { id: 3, message: 'Your support ticket has been updated.', timestamp: 'Yesterday', read: true, type: 'support' },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    socket.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      socket.off('new-notification');
    };
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
