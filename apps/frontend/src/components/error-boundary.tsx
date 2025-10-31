
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

function ErrorFallback() {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </button>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const onError = (error: Error) => {
    toast.error(error.message);
  };

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      {children}
    </ReactErrorBoundary>
  );
}
