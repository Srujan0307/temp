export function CalendarEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-semibold">No events to display</h3>
      <p className="text-muted-foreground">
        Try adjusting your filters or creating a new event.
      </p>
    </div>
  );
}