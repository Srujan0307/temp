import { QueryClient } from '@tanstack/react-query';

export const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
      mutations: {
        retry: 1,
      },
    },
  });
