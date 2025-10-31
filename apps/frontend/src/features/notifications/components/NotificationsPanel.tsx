import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const NotificationsPanel = () => {
  const { notifications, markAllAsRead } = useNotifications();

  // This is a placeholder for grouping logic
  const todayNotifications = notifications.slice(0, 1);
  const earlierNotifications = notifications.slice(1);

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-medium">Notifications</h4>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          <Check className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {todayNotifications.length > 0 && (
          <div>
            <p className="p-2 text-sm font-medium text-muted-foreground">Today</p>
            <ul>
              {todayNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </ul>
          </div>
        )}
        {earlierNotifications.length > 0 && (
          <div>
            <p className="p-2 text-sm font-medium text-muted-foreground">Earlier</p>
            <ul>
              {earlierNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </ul>
          </div>
        )}
        {notifications.length === 0 && (
          <p className="p-4 text-center text-muted-foreground">No new notifications</p>
        )}
      </div>
    </div>
  );
};