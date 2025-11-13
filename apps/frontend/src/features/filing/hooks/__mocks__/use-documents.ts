
import { vi } from 'vitest';

export const useDocuments = vi.fn().mockReturnValue({
  documents: [
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
  ],
  isLoading: false,
  uploadDocument: vi.fn(),
  deleteDocument: vi.fn(),
});
