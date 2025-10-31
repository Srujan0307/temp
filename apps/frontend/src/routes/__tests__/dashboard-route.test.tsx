import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AppProviders } from '@/app/providers';
import { ProtectedRoute } from '@/router/protected-route';
import { DashboardRoute } from '@/routes/dashboard';

import { useAuth } from '@/features/auth/use-auth';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

vi.mock('@/features/auth/use-auth');

describe('DashboardRoute', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
    });
  });

  it('renders dashboard content for authenticated users', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route index element={<DashboardRoute />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});
