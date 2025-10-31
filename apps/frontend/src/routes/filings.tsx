import {
  FilingsBoard,
  FilingsFilters,
  FilingsSkeletons,
} from '@/features/filings';
import { useState } from 'react';

export function FilingsRoute() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return (
    <>
      <h1 className="text-2xl font-bold">Filings</h1>
      <FilingsFilters />
      {isLoading ? <FilingsSkeletons /> : <FilingsBoard />}
    </>
  );
}
