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

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route
            path="/analytics"
            element={<Placeholder title="Analytics" />}
          />
          <Route path="/billing" element={<Placeholder title="Billing" />} />
          <Route path="/clients" element={<Placeholder title="Clients" />} />
          <Route path="/filings" element={<Placeholder title="Filings" />} />
          <Route path="/calendar" element={<Placeholder title="Calendar" />} />
          <Route path="/users" element={<Placeholder title="Users" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
          <Route path="/help" element={<Placeholder title="Help" />} />
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
