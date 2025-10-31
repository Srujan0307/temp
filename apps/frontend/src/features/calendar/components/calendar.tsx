import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  type Event,
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { CalendarToolbar } from './custom-toolbar';
import { CalendarCellSkeleton } from './calendar-cell-skeleton';
import { CalendarEmptyState } from './calendar-empty-state';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface CalendarEvent extends Event {
  id: string;
  resourceId?: string;
}

export function Calendar({
  events,
  isLoading,
  onSelectEvent,
}: {
  events: CalendarEvent[];
  isLoading: boolean;
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-7 grid-rows-5 gap-px">
        {Array.from({ length: 35 }).map((_, i) => (
          <CalendarCellSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <CalendarEmptyState />;
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        components={{
          toolbar: CalendarToolbar,
        }}
      />
    </div>
  );
}