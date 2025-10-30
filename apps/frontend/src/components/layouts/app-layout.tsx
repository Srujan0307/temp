import { Outlet } from 'react-router-dom';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/use-auth';

export const AppLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/40 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Monorepo Frontend</span>
            <span className="text-sm text-muted-foreground">
              React + Vite + ShadCN UI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-10">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container text-sm text-muted-foreground">
          Built with Vite, React, TypeScript, and TanStack Query.
        </div>
      </footer>
    </div>
  );
};
