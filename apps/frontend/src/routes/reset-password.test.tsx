
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ResetPasswordRoute } from './reset-password';
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


describe('ResetPasswordRoute', () => {
  it('renders the reset password form', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false, logout: vi.fn() }}>
                <MemoryRouter>
                    <ResetPasswordRoute />
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );

    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('calls the reset password function on form submit', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ login: mockLogin, isAuthenticated: false, logout: vi.fn() }}>
                <MemoryRouter>
                    <ResetPasswordRoute />
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(mockMutate).toHaveBeenCalled();
  });
});
