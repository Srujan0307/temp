
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationItem } from '../components/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';

jest.mock('../hooks/useNotifications');

const mockNotification = {
  id: 1,
  message: 'Notification 1',
  timestamp: '1 minute ago',
  read: false,
  type: 'order',
};

describe('NotificationItem', () => {
  it('should render the notification', () => {
    (useNotifications as jest.Mock).mockReturnValue({ markAsRead: jest.fn() });
    render(<NotificationItem notification={mockNotification} />);
    expect(screen.getByText('Notification 1')).toBeInTheDocument();
  });

  it('should call markAsRead when the "Mark as read" button is clicked', () => {
    const markAsRead = jest.fn();
    (useNotifications as jest.Mock).mockReturnValue({ markAsRead });
    render(<NotificationItem notification={mockNotification} />);
    fireEvent.click(screen.getByLabelText('Mark as read'));
    expect(markAsRead).toHaveBeenCalledWith(mockNotification.id);
  });
});
