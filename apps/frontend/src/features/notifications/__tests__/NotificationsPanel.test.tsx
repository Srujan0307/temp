
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { useNotifications } from '../hooks/useNotifications';

jest.mock('../hooks/useNotifications');

const mockNotifications = [
  { id: 1, message: 'Notification 1', timestamp: '1 minute ago', read: false, type: 'order' },
  { id: 2, message: 'Notification 2', timestamp: '2 minutes ago', read: true, type: 'announcement' },
];

describe('NotificationsPanel', () => {
  it('should render the notifications', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: mockNotifications,
      markAllAsRead: jest.fn(),
    });
    render(<NotificationsPanel />);
    expect(screen.getByText('Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Notification 2')).toBeInTheDocument();
  });

  it('should call markAllAsRead when the "Mark all as read" button is clicked', () => {
    const markAllAsRead = jest.fn();
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: mockNotifications,
      markAllAsRead,
    });
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByText('Mark all as read'));
    expect(markAllAsRead).toHaveBeenCalled();
  });
});
