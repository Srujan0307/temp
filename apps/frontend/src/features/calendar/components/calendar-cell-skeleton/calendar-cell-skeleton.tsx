import { Skeleton } from '@/components/ui/skeleton';

export function CalendarCellSkeleton() {
  return (
    <div className="p-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}