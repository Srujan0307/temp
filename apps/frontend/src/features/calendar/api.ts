import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '../../lib/axios';

export const CALENDAR_CACHE_KEY = 'calendar';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  resourceId?: string;
  sla?: {
    due: string;
    warning: string;
  };
}

export type ReminderOption = '5m' | '15m' | '30m' | '1h' | '2h';

export interface CalendarFilters {
  assignees?: string[];
  statuses?: string[];
  query?: string;
}

export interface CalendarEventResource {
  event: CalendarEvent;
}

const getCalendarEvents = async (
  start: string,
  end: string,
  filters: CalendarFilters,
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams();
  params.append('start', start);
  params.append('end', end);

  if (filters.assignees?.length) {
    params.append('assignees', filters.assignees.join(','));
  }

  if (filters.statuses?.length) {
    params.append('statuses', filters.statuses.join(','));
  }

  if (filters.query) {
    params.append('query', filters.query);
  }

  const { data } = await axios.get<CalendarEvent[]>(`/calendar?${params.toString()}`);
  return data;
};

export const useCalendarEvents = (start: string, end: string, filters: CalendarFilters) =>
  useQuery({
    queryKey: [CALENDAR_CACHE_KEY, start, end, filters],
    queryFn: () => getCalendarEvents(start, end, filters),
  });

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEvent: Omit<CalendarEvent, 'id'>) =>
      axios.post<CalendarEvent>('/calendar', newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_CACHE_KEY] });
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedEvent: CalendarEvent) =>
      axios.put<CalendarEvent>(`/calendar/${updatedEvent.id}`, updatedEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_CACHE_KEY] });
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => axios.delete(`/calendar/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_CACHE_KEY] });
    },
  });
};
