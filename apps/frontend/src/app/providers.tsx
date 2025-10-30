import { PropsWithChildren, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider } from '@/features/auth/auth-provider';
import { createAppQueryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/components/theme/theme-provider';

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {import.meta.env.DEV ? (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          ) : null}
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
