import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KanbanBoard, KanbanFilters, KanbanCard, KanbanColumn } from './api';
import { socket } from '../../services/socket';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const KANBAN_BOARD_QUERY_KEY = 'kanban-board';

// Fetch hook
export const useKanbanBoard = (filters: KanbanFilters = {}) => {
  const queryClient = useQueryClient();

  const queryKey = [KANBAN_BOARD_QUERY_KEY, filters];

  const queryFn = async (): Promise<KanbanBoard> => {
    const params = new URLSearchParams();
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.assigneeIds) {
      filters.assigneeIds.forEach((id) => params.append('assigneeIds', id));
    }
    const response = await fetch(`/api/kanban/board?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Kanban board');
    }
    return response.json();
  };

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn,
  });

  useEffect(() => {
    const handleBoardUpdate = (updatedBoard: KanbanBoard) => {
      queryClient.setQueryData(queryKey, updatedBoard);
    };

    socket.on('board-update', handleBoardUpdate);

    return () => {
      socket.off('board-update', handleBoardUpdate);
    };
  }, [queryClient, queryKey]);

  return {
    board: data,
    ...rest,
  };
};

// Mutation hooks
export const useMoveCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, newColumnId, newOrder }: { cardId: string; newColumnId: string; newOrder: number }) => {
      const response = await fetch(`/api/kanban/cards/${cardId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newColumnId, newOrder }),
      });
      if (!response.ok) {
        throw new Error('Failed to move card');
      }
      return response.json();
    },
    onMutate: async ({ cardId, newColumnId, newOrder }) => {
      await queryClient.cancelQueries({ queryKey: [KANBAN_BOARD_QUERY_KEY] });
      const previousBoard = queryClient.getQueryData<KanbanBoard>([KANBAN_BOARD_QUERY_KEY]);

      if (previousBoard) {
        const updatedBoard = { ...previousBoard };
        let cardToMove: KanbanCard | undefined;
        
        // Find and remove the card from its original column
        updatedBoard.columns.forEach(column => {
          const cardIndex = column.cards.findIndex(card => card.id === cardId);
          if (cardIndex > -1) {
            cardToMove = column.cards.splice(cardIndex, 1)[0];
          }
        });

        // Add the card to the new column and update order
        if (cardToMove) {
          cardToMove.columnId = newColumnId;
          const newColumn = updatedBoard.columns.find(column => column.id === newColumnId);
          if (newColumn) {
            newColumn.cards.splice(newOrder, 0, cardToMove);
            // Re-order the cards in the new column
            newColumn.cards.forEach((card, index) => card.order = index);
          }
        }
        
        queryClient.setQueryData([KANBAN_BOARD_QUERY_KEY], updatedBoard);
      }
      
      return { previousBoard };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData([KANBAN_BOARD_QUERY_KEY], context.previousBoard);
      }
      toast.error('Failed to move card. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KANBAN_BOARD_QUERY_KEY] });
    },
  });
};

export const useReassignCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, assigneeId }: { cardId: string; assigneeId?: string }) => {
      const response = await fetch(`/api/kanban/cards/${cardId}/reassign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigneeId }),
      });
      if (!response.ok) {
        throw new Error('Failed to reassign card');
      }
      return response.json();
    },
    onMutate: async ({ cardId, assigneeId }) => {
      await queryClient.cancelQueries({ queryKey: [KANBAN_BOARD_QUERY_KEY] });
      const previousBoard = queryClient.getQueryData<KanbanBoard>([KANBAN_BOARD_QUERY_KEY]);

      if (previousBoard) {
        const updatedBoard = { ...previousBoard };
        updatedBoard.columns.forEach(column => {
          const card = column.cards.find(c => c.id === cardId);
          if (card) {
            card.assigneeId = assigneeId;
          }
        });
        queryClient.setQueryData([KANBAN_BOARD_QUERY_KEY], updatedBoard);
      }
      
      return { previousBoard };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData([KANBAN_BOARD_QUERY_KEY], context.previousBoard);
      }
      toast.error('Failed to reassign card. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KANBAN_BOARD_QUERY_KEY] });
    },
  });
};

export const useAddCardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ columnId, title }: { columnId: string; title: string }) => {
      const response = await fetch('/api/kanban/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId, title }),
      });
      if (!response.ok) {
        throw new Error('Failed to add card');
      }
      return response.json();
    },
    onSuccess: (newCard: KanbanCard) => {
      queryClient.setQueryData<KanbanBoard>([KANBAN_BOARD_QUERY_KEY], (oldBoard) => {
        if (!oldBoard) return oldBoard;
        
        const newBoard = { ...oldBoard };
        const column = newBoard.columns.find(c => c.id === newCard.columnId);
        if (column) {
          column.cards.push(newCard);
        }
        return newBoard;
      });
      toast.success('Card added successfully');
    },
    onError: () => {
      toast.error('Failed to add card. Please try again.');
    },
  });
};

