import { CalendarEvent } from './api';

export const adaptCalendarEventsForBigCalendar = (events: CalendarEvent[]) => {
  return events.map((event) => {
    const now = new Date();
    const dueDate = event.sla?.due ? new Date(event.sla.due) : null;
    const warningDate = event.sla?.warning ? new Date(event.sla.warning) : null;

    let colorToken = 'bg-primary-500';
    if (dueDate && now > dueDate) {
      colorToken = 'bg-red-500';
    } else if (warningDate && now > warningDate) {
      colorToken = 'bg-yellow-500';
    }

    return {
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
      resource: {
        ...event,
        colorToken,
      },
    };
  });
};
