import { PropsWithChildren, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider } from '@/features/auth/auth-context';
import { createAppQueryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ErrorBoundary } from '@/components/error-boundary';

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            {import.meta.env.DEV && !import.meta.env.VITEST_WORKER_ID ? (
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
            ) : null}
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
