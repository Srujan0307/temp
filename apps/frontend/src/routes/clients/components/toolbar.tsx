
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { List, Grid } from 'lucide-react';

type ClientsToolbarProps = {
  setView: (view: 'table' | 'grid') => void;
};

export function ClientsToolbar({ setView }: ClientsToolbarProps) {
  return (
    <div className="flex justify-between">
      <Input placeholder="Search clients..." className="max-w-xs" />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setView('table')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setView('grid')}>
          <Grid className="h-4 w-4" />
        </Button>
        <Button>New Client</Button>
      </div>
    </div>
  );
}
