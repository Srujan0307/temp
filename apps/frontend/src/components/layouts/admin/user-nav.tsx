
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/use-auth';
import type { User } from '@/features/auth/services/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('');
}

interface UserNavProps {
  user: User | null;
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserNavSimple({ user }: UserNavProps) {
  const { logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{user.fullName}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
        <Button size="sm" variant="link" className="p-0" onClick={logout}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

UserNav.Simple = UserNavSimple;
