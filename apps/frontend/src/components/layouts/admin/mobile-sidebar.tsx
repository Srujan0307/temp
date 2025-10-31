
import { Menu } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
      </SheetContent>
    </Sheet>
  );
}
