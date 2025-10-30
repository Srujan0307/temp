
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground">
        Dashboard
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const link = [...navLinks.top, ...navLinks.bottom].find(
          l => l.href === to,
        );
        const title = link ? link.title : value;

        return (
          <div key={to} className="flex items-center space-x-2">
            <span>/</span>
            <Link
              to={to}
              className={cn(
                'hover:text-foreground',
                isLast && 'text-foreground',
              )}
            >
              {title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
