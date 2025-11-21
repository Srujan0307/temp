import { adaptCalendarEventsForBigCalendar } from '../../features/calendar';
import { CalendarEvent } from '../../features/calendar/api';

describe('calendar helpers', () => {
  it('adaptCalendarEventsForBigCalendar adapts events and computes color tokens', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'On time',
        start: '2023-01-01T10:00:00Z',
        end: '2023-01-01T11:00:00Z',
        allDay: false,
        sla: {
          due: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
          warning: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // 12 hours from now
        },
      },
      {
        id: '2',
        title: 'Warning',
        start: '2023-01-02T10:00:00Z',
        end: '2023-01-02T11:00:00Z',
        allDay: false,
        sla: {
          due: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
          warning: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        },
      },
      {
        id: '3',
        title: 'Overdue',
        start: '2023-01-03T10:00:00Z',
        end: '2023-01-03T11:00:00Z',
        allDay: false,
        sla: {
          due: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          warning: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
      },
      {
        id: '4',
        title: 'No SLA',
        start: '2023-01-04T10:00:00Z',
        end: '2023-01-04T11:00:00Z',
        allDay: false,
      },
    ];

    const adaptedEvents = adaptCalendarEventsForBigCalendar(events);

    expect(adaptedEvents[0].resource.colorToken).toBe('bg-primary-500');
    expect(adaptedEvents[1].resource.colorToken).toBe('bg-yellow-500');
    expect(adaptedEvents[2].resource.colorToken).toBe('bg-red-500');
    expect(adaptedEvents[3].resource.colorToken).toBe('bg-primary-500');

    expect(adaptedEvents[0].start).toBeInstanceOf(Date);
    expect(adaptedEvents[0].end).toBeInstanceOf(Date);
  });
});
