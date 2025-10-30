import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { healthService } from '@/services/health-service';

export const DashboardRoute = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: healthService.fetchHealth,
    staleTime: 1000 * 60,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your workspace overview with live system status.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>API Health</CardTitle>
            <CardDescription>
              Infrastructure heartbeat information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <span className="text-sm text-muted-foreground">
                Loading status…
              </span>
            ) : isError ? (
              <span className="text-sm text-destructive">
                Unable to reach the API right now.
              </span>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-semibold capitalize">
                  {data?.status ?? 'unknown'}
                </div>
                <p className="text-sm text-muted-foreground">
                  Last checked just now.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
