
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ForgotPasswordRoute } from './forgot-password';
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


describe('ForgotPasswordRoute', () => {
  it('renders the forgot password form', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false, logout: vi.fn() }}>
                <MemoryRouter>
                    <ForgotPasswordRoute />
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('calls the forgot password function on form submit', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false, logout: vi.fn() }}>
                <MemoryRouter>
                    <ForgotPasswordRoute />
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(mockMutate).toHaveBeenCalled();
  });
});
