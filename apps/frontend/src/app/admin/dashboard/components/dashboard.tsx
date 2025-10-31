
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KpiCard } from './kpi-card';
import { WorkloadChart } from './workload-chart';
import { SlaChart } from './sla-chart';
import { DollarSign, AlertTriangle, Clock, Users } from 'lucide-react';

const queryClient = new QueryClient();

function DashboardComponent() {
  const [tenant, setTenant] = useState('all');

  // Mock data until the API is ready
  const analyticsData = {
    slaCompliance: 98.5,
    upcomingDeadlines: 12,
    workloadDistribution: {
      teamA: 45,
      teamB: 30,
      teamC: 25,
    },
    overdueItems: 3,
  };

  // Placeholder for API call with TanStack Query
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['analytics', { tenant, dateRange }],
  //   queryFn: () => fetchAnalyticsData({ tenant, dateRange }),
  //   refetchInterval: 5000, // Polling every 5 seconds
  // });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select value={tenant} onValueChange={setTenant}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tenants</SelectItem>
              <SelectItem value="tenant1">Tenant 1</SelectItem>
              <SelectItem value="tenant2">Tenant 2</SelectItem>
              <SelectItem value="tenant3">Tenant 3</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="SLA Compliance"
          value={`${analyticsData.slaCompliance}%`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Compliance rate for the last 30 days"
        />
        <KpiCard
          title="Upcoming Deadlines"
          value={analyticsData.upcomingDeadlines.toString()}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="Tasks due in the next 7 days"
        />
        <KpiCard
          title="Overdue Items"
          value={analyticsData.overdueItems.toString()}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          description="Items past their due date"
        />
        <KpiCard
          title="Workload Distribution"
          value="View"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Distribution of tasks across teams"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>SLA Compliance Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SlaChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkloadChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardComponent />
    </QueryClientProvider>
  );
}
