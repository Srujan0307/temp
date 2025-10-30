
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { SignupRoute } from './signup';
import { AuthContext } from '@/features/auth/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const mockLogin = vi.fn();
const mockUseAuth = () => ({
  login: mockLogin,
  isAuthenticated: false,
});

vi.mock('@/features/auth/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockMutate = vi.fn();
vi.mock('@tanstack/react-query', async () => {
    const original = await vi.importActual('@tanstack/react-query');
    return {
        ...original,
        useMutation: vi.fn(() => ({
            mutate: mockMutate,
            isPending: false,
        })),
    };
});


describe('SignupRoute', () => {
  it('renders the signup form', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false, logout: vi.fn() }}>
                <MemoryRouter>
                    <SignupRoute />
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('calls the signup function on form submit', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false, logout: vi.fn() }}>
                <MemoryRouter>
                    <SignupRoute />
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockMutate).toHaveBeenCalled();
  });
});
