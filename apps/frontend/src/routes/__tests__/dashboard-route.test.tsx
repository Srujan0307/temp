import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AppProviders } from '@/app/providers';
import { AppLayout } from '@/components/layouts/app-layout';
import { ProtectedRoute } from '@/router/protected-route';
import { DashboardRoute } from '@/routes/dashboard';

const AUTH_TOKEN_STORAGE_KEY = 'app.authToken';

describe('DashboardRoute', () => {
  beforeEach(() => {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'test-token');
  });

  afterEach(() => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    cleanup();
  });

  it('renders dashboard content for authenticated users', async () => {
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardRoute />} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </AppProviders>,
    );

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/monorepo frontend/i)).toBeInTheDocument();
  });
});
