import { Outlet, Link } from 'react-router-dom';
import './PortalLayout.css';

const PortalLayout = () => {
  return (
    <div className="portal-layout">
      <nav className="portal-nav">
        <h1>Client Portal</h1>
        <ul>
          <li>
            <Link to="overview">Overview</Link>
          </li>
          <li>
            <Link to="vehicles">Vehicles</Link>
          </li>
          <li>
            <Link to="filings">Filings</Link>
          </li>
          <li>
            <Link to="calendar">Calendar</Link>
          </li>
        </ul>
      </nav>
      <main className="portal-main">
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;
