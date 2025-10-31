import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { AdminLayout } from '@/components/layouts/admin/admin-layout';
import { AppLayout } from '@/components/layouts/app-layout';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { ProtectedRoute } from '@/router/protected-route';
import { DashboardRoute } from '@/routes/dashboard';
import { LoginRoute } from '@/routes/login';
import { SignupRoute } from '@/routes/signup';
import { ForgotPasswordRoute } from '@/routes/forgot-password';
import { ResetPasswordRoute } from '@/routes/reset-password';
import { ProfileRoute } from '@/routes/profile';
import { ClientsRoute } from '@/routes/clients';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route
            path="/analytics"
            element={<div>Analytics</div>}
          />
          <Route path="/billing" element={<div>Billing</div>} />
          <Route path="/clients" element={<ClientsRoute />} />
          <Route path="/filings" element={<div>Filings</div>} />
          <Route path="/calendar" element={<div>Calendar</div>} />
          <Route path="/users" element={<div>Users</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
          <Route path="/help" element={<div>Help</div>} />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
        <Route path="/reset-password" element={<ResetPasswordRoute />} />
      </Route>
    </Route>,
  ),
);
