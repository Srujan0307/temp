
import { UploadProgress } from './upload-progress';

interface Upload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

interface UploadQueueProps {
  uploads: Upload[];
  onCancel: (file: File) => void;
  onRetry: (file: File) => void;
}

export function UploadQueue({ uploads, onCancel, onRetry }: UploadQueueProps) {
  return (
    <div className="space-y-4">
      {uploads.map((upload) => (
        <UploadProgress
          key={upload.file.name}
          fileName={upload.file.name}
          progress={upload.progress}
          status={upload.status}
          onCancel={() => onCancel(upload.file)}
          onRetry={() => onRetry(upload.file)}
        />
      ))}
    </div>
  );
}
