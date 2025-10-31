import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

const AuthLayout = React.lazy(
  () => import('@/components/layouts/auth-layout'),
);
const LoginRoute = React.lazy(() => import('@/routes/login'));
const SignupRoute = React.lazy(() => import('@/routes/signup'));
const ForgotPasswordRoute = React.lazy(
  () => import('@/routes/forgot-password'),
);
const ResetPasswordRoute = React.lazy(
  () => import('@/routes/reset-password'),
);

export const AuthRoutes = (
  <Route
    element={
      <Suspense fallback={<div>Loading...</div>}>
        <AuthLayout />
      </Suspense>
    }
  >
    <Route path="/login" element={<LoginRoute />} />
    <Route path="/signup" element={<SignupRoute />} />
    <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
    <Route path="/reset-password" element={<ResetPasswordRoute />} />
  </Route>
);
