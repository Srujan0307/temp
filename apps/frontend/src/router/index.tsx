import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { ProtectedRoute } from '@/router/protected-route';
import { AdminRoutes } from './admin';
import { AuthRoutes } from './auth';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoute />}>{AdminRoutes}</Route>
      {AuthRoutes}
    </Route>,
  ),
);

