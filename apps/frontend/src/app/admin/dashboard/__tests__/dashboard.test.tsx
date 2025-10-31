
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../components/dashboard';
import '@testing-library/jest-dom';

// Mock the chart components
jest.mock('../components/workload-chart', () => ({
  WorkloadChart: () => <div>Workload Chart</div>,
}));
jest.mock('../components/sla-chart', () => ({
  SlaChart: () => <div>SLA Chart</div>,
}));

// Mock the DateRangePicker component
jest.mock('@/components/ui/date-range-picker', () => ({
  DateRangePicker: () => <button>Date Range Picker</button>,
}));

describe('Dashboard', () => {
  it('renders the dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the KPI cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('SLA Compliance')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Deadlines')).toBeInTheDocument();
    expect(screen.getByText('Overdue Items')).toBeInTheDocument();
    expect(screen.getByText('Workload Distribution')).toBeInTheDocument();
  });

  it('renders the charts', () => {
    render(<Dashboard />);
    expect(screen.getByText('SLA Compliance Over Time')).toBeInTheDocument();
    expect(screen.getByText('Workload Distribution')).toBeInTheDocument();
  });

  it('renders the filters', () => {
    render(<Dashboard />);
    expect(screen.getByText('Select a tenant')).toBeInTheDocument();
    expect(screen.getByText('Date Range Picker')).toBeInTheDocument();
  });
});
