
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  fileName: string;
  progress: number;
  onCancel: () => void;
  onRetry: () => void;
  status: 'uploading' | 'success' | 'error';
}

export function UploadProgress({
  fileName,
  progress,
  onCancel,
  onRetry,
  status,
}: UploadProgressProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <p className="font-medium">{fileName}</p>
        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-full" />
          <span>{progress}%</span>
        </div>
      </div>
      {status === 'uploading' && (
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
      {status === 'error' && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
