
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Nav } from './nav';
import { navLinks } from './nav-links';
import { useAuth } from '@/features/auth/use-auth';

const mockUser = (role: string) => ({
  id: '1',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  role,
  avatarUrl: '',
});

vi.mock('@/features/auth/use-auth');

describe('Nav', () => {
  it('renders all links for admin user', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser('admin'),
    });

    render(
      <MemoryRouter>
        <Nav isCollapsed={false} links={[...navLinks.top, ...navLinks.bottom]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Filings')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
  });

  it('renders correct links for member user', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser('member'),
    });

    render(
      <MemoryRouter>
        <Nav isCollapsed={false} links={[...navLinks.top, ...navLinks.bottom]} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.queryByText('Billing')).not.toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Filings')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
  });
});

