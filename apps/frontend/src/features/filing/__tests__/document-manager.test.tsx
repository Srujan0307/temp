
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

import { DocumentManager } from '../components/document-manager';
import { useDocuments } from '../hooks/use-documents';

vi.mock('../hooks/use-documents');

const queryClient = new QueryClient();

const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={['/filings/1']}>
      <Routes>
        <Route path="/filings/:filingId" element={children} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('DocumentManager', () => {
  it('should render the document manager', () => {
    render(
      <Wrapper>
        <DocumentManager />
      </Wrapper>,
    );

    expect(
      screen.getByRole('heading', { name: /upload documents/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /documents/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('v1')).toBeInTheDocument();
    expect(screen.getByText('v2')).toBeInTheDocument();
  });

  it('should call deleteDocument when delete is confirmed', async () => {
    const deleteDocument = vi.fn();
    (useDocuments as vi.Mock).mockReturnValue({
      documents: [
        {
          id: '1',
          version: 'v1',
          uploadedBy: 'John Doe',
          date: '2023-10-31',
          status: 'available',
          size: '1.2 MB',
        },
      ],
      isLoading: false,
      uploadDocument: vi.fn(),
      deleteDocument,
    });

    render(
      <Wrapper>
        <DocumentManager />
      </Wrapper>,
    );

    fireEvent.click(screen.getByRole('button', { name: '' }));
    fireEvent.click(await screen.findByText(/delete/i));
    fireEvent.click(
      await screen.findByRole('button', {
        name: /delete/i,
      }),
    );

    expect(deleteDocument).toHaveBeenCalledWith('1');
  });
});
