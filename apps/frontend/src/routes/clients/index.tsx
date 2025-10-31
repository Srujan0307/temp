
import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ClientsToolbar } from './components/toolbar';
import { ClientsTable } from './components/table';
import { ClientsCard } from './components/card';

type View = 'table' | 'grid';

export function ClientsRoute() {
  const [view, setView] = useState<View>('table');

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Clients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4 flex items-center justify-between">
          <div>
              <h1 className="text-2xl font-bold">Clients</h1>
              <p className="text-muted-foreground">
                  Browse and manage your clients.
              </p>
          </div>
      </div>
      <div className="mt-4">
          <ClientsToolbar setView={setView} />
          <div className="mt-4">
              {view === 'table' ? <ClientsTable /> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><ClientsCard /></div>}
          </div>
      </div>
    </>
  );
}
