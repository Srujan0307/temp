
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// TODO: Replace with real API calls
const fetchDocuments = async (filingId: string) => {
  console.log('Fetching documents for filing:', filingId);
  return [
    {
      id: '1',
      version: 'v1',
      uploadedBy: 'John Doe',
      date: '2023-10-31',
      status: 'available',
      size: '1.2 MB',
    },
    {
      id: '2',
      version: 'v2',
      uploadedBy: 'Jane Doe',
      date: '2023-11-01',
      status: 'scanning',
      size: '2.3 MB',
    },
  ];
};

const uploadDocument = async ({
  filingId,
  file,
}: {
  filingId: string;
  file: File;
}) => {
  console.log('Uploading document for filing:', filingId, file.name);
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    // TODO: Update progress
  }
  return {
    id: '3',
    version: 'v3',
    uploadedBy: 'User',
    date: new Date().toISOString().split('T')[0],
    status: 'scanning',
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
  };
};

const deleteDocument = async ({
  filingId,
  documentId,
}: {
  filingId: string;
  documentId: string;
}) => {
  console.log('Deleting document:', documentId, 'from filing:', filingId);
  return { success: true };
};

export function useDocuments(filingId: string) {
  const queryClient = useQueryClient();
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', filingId],
    queryFn: () => fetchDocuments(filingId),
    refetchInterval: (data) => {
      const isScanning = data?.some((doc) => doc.status === 'scanning');
      return isScanning ? 5000 : false;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument({ filingId, file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', filingId] });
      toast.success('Document uploaded successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument({ filingId, documentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', filingId] });
      toast.success('Document deleted successfully');
    },
  });

  return {
    documents,
    isLoading,
    uploadDocument: uploadMutation.mutate,
    deleteDocument: deleteMutation.mutate,
  };
}
