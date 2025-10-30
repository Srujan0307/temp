
import { Nav } from './nav';
import { navLinks } from './nav-links';

interface MainNavProps {
  isCollapsed: boolean;
}

export function MainNav({ isCollapsed }: MainNavProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Nav isCollapsed={isCollapsed} links={navLinks.top} />
      <div className="mt-auto flex w-full flex-col gap-2">
        <Nav isCollapsed={isCollapsed} links={navLinks.bottom} />
      </div>
    </div>
  );
}
