
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b bg-card/40 px-4 backdrop-blur sm:px-8 md:hidden">
      <MobileSidebar />
      <UserNav />
    </header>
  );
}
