
import { Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useIsCollapsed } from '@/hooks/use-is-collapsed';

import { Sidebar } from './sidebar';
import { Header } from './header';

export function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();

  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={cn(
          'overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0',
          isCollapsed ? 'md:ml-14' : 'md:ml-64',
        )}
      >
        <Header />
        <div className="px-4 py-10 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
