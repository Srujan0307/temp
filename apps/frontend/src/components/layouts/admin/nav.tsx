
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useAuth } from '@/features/auth/use-auth';
import type { LucideIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export interface NavLink {
  title: string;
  href: string;
  icon: LucideIcon;
  role?: string[];
}

interface NavProps {
  isCollapsed: boolean;
  links: NavLink[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredLinks = links.filter(link => {
    if (!link.role) {
      return true;
    }
    if (!user) {
      return false;
    }
    return link.role.includes(user.role);
  });

  return (
    <TooltipProvider>
      <nav
        className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
        data-collapsed={isCollapsed}
      >
        {filteredLinks.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={link.href}
                  className={cn(
                    buttonVariants({
                      variant:
                        location.pathname === link.href ? 'default' : 'ghost',
                      size: 'icon',
                    }),
                    'h-9 w-9',
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="flex items-center gap-4"
              >
                {link.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              to={link.href}
              className={cn(
                buttonVariants({
                  variant:
                    location.pathname === link.href ? 'default' : 'ghost',
                  size: 'sm',
                }),
                'justify-start',
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
            </Link>
          ),
        )}
      </nav>
    </TooltipProvider>
  );
}
