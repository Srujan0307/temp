import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from './components/layouts/PortalLayout';
import Overview from './pages/portal/Overview';
import Vehicles from './pages/portal/Vehicles';
import Filings from './pages/portal/Filings';
import Calendar from './pages/portal/Calendar';

// Mock auth hook
const useAuth = () => ({
  // Set to client to see portal, set to admin to see redirect
  role: 'client',
});

function App() {
  const { role } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/portal"
          element={
            role === 'client' ? <PortalLayout /> : <Navigate to="/admin" />
          }
        >
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="filings" element={<Filings />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
        <Route
          path="/admin"
          element={<div>Admin Dashboard (placeholder)</div>}
        />
        <Route
          path="/"
          element={<Navigate to={role === 'client' ? '/portal' : '/admin'} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
