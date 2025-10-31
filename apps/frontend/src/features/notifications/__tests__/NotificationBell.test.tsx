
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotificationBell } from '../components/NotificationBell';
import { useNotifications } from '../hooks/useNotifications';

jest.mock('../hooks/useNotifications');

describe('NotificationBell', () => {
  it('should render the bell icon', () => {
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount: 0 });
    render(<NotificationBell />);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('should display the unread count badge when there are unread notifications', () => {
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount: 3 });
    render(<NotificationBell />);
    expect(screen.getByLabelText('Notifications')).toContainHTML('<span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary" />');
  });

  it('should not display the unread count badge when there are no unread notifications', () => {
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount: 0 });
    render(<NotificationBell />);
    expect(screen.getByLabelText('Notifications')).not.toContainHTML('<span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary" />');
  });
});
