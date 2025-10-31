import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LoginRoute } from '../login';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/auth-context';

const queryClient = new QueryClient();

const renderComponent = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <LoginRoute />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('LoginRoute', () => {
  it('should render the login form', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should allow the user to type in the email and password fields', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password');
  });
});
