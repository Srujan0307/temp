import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { AppLayout } from '@/components/layouts/app-layout';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { ProtectedRoute } from '@/router/protected-route';
import { DashboardRoute } from '@/routes/dashboard';
import { LoginRoute } from '@/routes/login';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardRoute />} />
        </Route>
      </Route>
      <Route path="/login" element={<AuthLayout />}>
        <Route index element={<LoginRoute />} />
      </Route>
    </Route>,
  ),
);
