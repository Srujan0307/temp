import { renderHook, act } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKanbanBoard, useMoveCardMutation } from '../hooks';
import { KanbanBoard } from '../api';
import { Server as MockSocketServer } from 'socket.io';
import Client from 'socket.io-client';

const mockBoard: KanbanBoard = {
  id: 'board-1',
  title: 'Test Board',
  columns: [
    { id: 'col-1', title: 'To Do', order: 0, cards: [{ id: 'card-1', title: 'Task 1', content: '', order: 0, columnId: 'col-1' }] },
    { id: 'col-2', title: 'In Progress', order: 1, cards: [] },
  ],
};

const server = setupServer(
  rest.get('/api/kanban/board', (req, res, ctx) => {
    return res(ctx.json(mockBoard));
  }),
  rest.patch('/api/kanban/cards/:cardId/move', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

let queryClient: QueryClient;
let wrapper: React.FC;

describe('Kanban Hooks', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it('useKanbanBoard should fetch and return board data', async () => {
    const { result, waitFor } = renderHook(() => useKanbanBoard(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.board).toEqual(mockBoard);
  });

  it('should optimistically update board on card move', async () => {
    // Seed the cache
    queryClient.setQueryData(['kanban-board', {}], mockBoard);

    const { result, waitFor } = renderHook(() => useMoveCardMutation(), { wrapper });

    act(() => {
      result.current.mutate({ cardId: 'card-1', newColumnId: 'col-2', newOrder: 0 });
    });

    await waitFor(() => {
        const board = queryClient.getQueryData<KanbanBoard>(['kanban-board', {}]);
        expect(board?.columns[1].cards[0].id).toBe('card-1');
    });
  });

  it('should rollback optimistic update on move error', async () => {
    server.use(
      rest.patch('/api/kanban/cards/:cardId/move', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    queryClient.setQueryData(['kanban-board', {}], mockBoard);
    
    const { result, waitFor } = renderHook(() => useMoveCardMutation(), { wrapper });

    act(() => {
      result.current.mutate({ cardId: 'card-1', newColumnId: 'col-2', newOrder: 0 });
    });

    await waitFor(() => {
        const board = queryClient.getQueryData<KanbanBoard>(['kanban-board', {}]);
        expect(board?.columns[0].cards[0].id).toBe('card-1');
    });
  });

  it('should update query cache on websocket event', async () => {
    const mockSocketServer = new MockSocketServer();
    const socket = Client(`http://localhost:${(mockSocketServer.engine as any).port}`);
    
    // Mock the global socket
    jest.mock('../../services/socket', () => ({
        socket,
    }));
    
    const { waitFor } = renderHook(() => useKanbanBoard(), { wrapper });
    
    const updatedBoard = { ...mockBoard, title: "Updated Board" };

    await waitFor(() => {
        act(() => {
            mockSocketServer.emit('board-update', updatedBoard);
        });
        const board = queryClient.getQueryData<KanbanBoard>(['kanban-board', {}]);
        expect(board?.title).toBe("Updated Board");
    });
    
    mockSocketServer.close();
    socket.close();
  });
});
