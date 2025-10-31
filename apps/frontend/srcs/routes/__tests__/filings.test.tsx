import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/test/render-with-providers';
import { FilingsRoute } from '@/routes/filings';

describe('FilingsRoute', () => {
  it('should render the filings board', () => {
    renderWithProviders(<FilingsRoute />);
    expect(screen.getByText('Filings')).toBeInTheDocument();
    expect(screen.getByText('Filings Board')).toBeInTheDocument();
  });
});
