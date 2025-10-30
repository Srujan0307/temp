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
import { SignupRoute } from '@/routes/signup';
import { ForgotPasswordRoute } from '@/routes/forgot-password';
import { ResetPasswordRoute } from '@/routes/reset-password';
import { ProfileRoute } from '@/routes/profile';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
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
