
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

interface UploaderProps {
  onUpload: (files: File[]) => void;
}

export function Uploader({ onUpload }: UploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUpload,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer',
        isDragActive && 'border-blue-500 bg-blue-50',
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-gray-400" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
}
