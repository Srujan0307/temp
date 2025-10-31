import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

const AdminLayout = React.lazy(
  () => import('@/components/layouts/admin/admin-layout'),
);
const DashboardRoute = React.lazy(() => import('@/routes/dashboard'));
const ProfileRoute = React.lazy(() => import('@/routes/profile'));

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

export const AdminRoutes = (
  <Route
    element={
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLayout />
      </Suspense>
    }
  >
    <Route index element={<DashboardRoute />} />
    <Route path="/profile" element={<ProfileRoute />} />
    <Route path="/analytics" element={<Placeholder title="Analytics" />} />
    <Route path="/billing" element={<Placeholder title="Billing" />} />
    <Route path="/clients" element={<Placeholder title="Clients" />} />
    <Route path="/filings" element={<Placeholder title="Filings" />} />
    <Route path="/calendar" element={<Placeholder title="Calendar" />} />
    <Route path="/users" element={<Placeholder title="Users" />} />
    <Route path="/settings" element={<Placeholder title="Settings" />} />
    <Route path="/help" element={<Placeholder title="Help" />} />
  </Route>
);
