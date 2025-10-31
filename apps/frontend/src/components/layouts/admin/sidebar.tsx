
import { ChevronsLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/use-auth';

import { MainNav } from './main-nav';
import { UserNav } from './user-nav';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user } = useAuth();

  const handleSidebarToggle = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 right-0 top-0 z-20 h-screen -translate-x-full border-r bg-card/40 backdrop-blur transition-[width] md:bottom-0 md:right-auto md:h-auto md:translate-x-0',
        isCollapsed ? 'md:w-14' : 'md:w-64',
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center px-4',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed && <span className="font-semibold">My App</span>}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={handleSidebarToggle}
        >
          <ChevronsLeft
            className={cn('h-5 w-5', isCollapsed && 'rotate-180')}
          />
        </Button>
      </div>
      <div
        className={cn(
          'flex grow flex-col gap-4 overflow-y-auto px-2',
          isCollapsed ? 'items-center' : '',
        )}
      >
        <MainNav isCollapsed={isCollapsed} />
      </div>
      <div
        className={cn(
          'absolute bottom-0 left-0 flex h-16 w-full items-center border-t px-2',
          isCollapsed ? 'justify-center' : '',
        )}
      >
        <UserNav user={user} />
      </div>
    </aside>
  );
}
