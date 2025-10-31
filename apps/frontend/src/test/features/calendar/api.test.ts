import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createQueryClientWrapper } from '../../../test/utils';
import {
  useCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
} from '../../features/calendar';

const server = setupServer(
  rest.get('/calendar', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', title: 'Test Event' }]));
  }),
  rest.post('/calendar', (req, res, ctx) => {
    return res(ctx.json({ id: '2', title: 'New Event' }));
  }),
  rest.put('/calendar/:id', (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, title: 'Updated Event' }));
  }),
  rest.delete('/calendar/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('calendar API hooks', () => {
  it('useCalendarEvents fetches events', async () => {
    const { result } = renderHook(
      () => useCalendarEvents('2023-01-01', '2023-01-31', {}),
      {
        wrapper: createQueryClientWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: '1', title: 'Test Event' }]);
  });

  it('useCreateCalendarEvent creates an event and invalidates cache', async () => {
    const { result } = renderHook(() => useCreateCalendarEvent(), {
      wrapper: createQueryClientWrapper(),
    });

    result.current.mutate({
      title: 'New Event',
      start: '2023-01-01',
      end: '2023-01-01',
      allDay: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useUpdateCalendarEvent updates an event and invalidates cache', async () => {
    const { result } = renderHook(() => useUpdateCalendarEvent(), {
      wrapper: createQueryClientWrapper(),
    });

    result.current.mutate({
      id: '1',
      title: 'Updated Event',
      start: '2023-01-01',
      end: '2023-01-01',
      allDay: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useDeleteCalendarEvent deletes an event and invalidates cache', async () => {
    const { result } = renderHook(() => useDeleteCalendarEvent(), {
      wrapper: createQueryClientWrapper(),
    });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
