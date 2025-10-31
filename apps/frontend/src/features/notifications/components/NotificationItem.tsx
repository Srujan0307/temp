
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, Megaphone, AlertCircle } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const notificationIcons = {
  order: <ShoppingCart className="h-5 w-5" />,
  announcement: <Megaphone className="h-5 w-5" />,
  support: <AlertCircle className="h-5 w-5" />,
  default: <CheckCircle className="h-5 w-5" />,
};

export const NotificationItem = ({ notification }) => {
  const { markAsRead } = useNotifications();
  const Icon = notificationIcons[notification.type] || notificationIcons.default;

  return (
    <li
      className={`flex items-start p-4 border-b hover:bg-muted/50 ${
        notification.read ? '' : 'bg-muted'
      }`}
    >
      <div className="flex-shrink-0">{Icon}</div>
      <div className="ml-4 flex-grow">
        <p className="text-sm">{notification.message}</p>
        <small className="text-xs text-muted-foreground">{notification.timestamp}</small>
      </div>
      {!notification.read && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => markAsRead(notification.id)}
          aria-label="Mark as read"
        >
          <CheckCircle className="h-5 w-5" />
        </Button>
      )}
    </li>
  );
};
