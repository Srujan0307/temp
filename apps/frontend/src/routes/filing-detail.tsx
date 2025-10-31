
import { useParams } from 'react-router-dom';

import { DocumentManager } from '@/features/filing/components/document-manager';

export function FilingDetailRoute() {
  const { filingId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Filing Detail {filingId}</h1>
      <DocumentManager />
    </div>
  );
}
