import { useEffect, useState } from 'react';

import { FilingChecklist } from './filing-checklist';
import { FilingComments } from './filing-comments';
import { FilingMetadata } from './filing-metadata';
import { FilingTimeline } from './filing-timeline';
import { FilingChecklistSkeleton } from './skeletons/filing-checklist-skeleton';
import { FilingMetadataSkeleton } from './skeletons/filing-metadata-skeleton';
import { FilingTimelineSkeleton } from './skeletons/filing-timeline-skeleton';

export const FilingDetail = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        {isLoading ? <FilingMetadataSkeleton /> : <FilingMetadata />}
      </div>
      <div className="col-span-6">
        {isLoading ? <FilingChecklistSkeleton /> : <FilingChecklist />}
      </div>
      <div className="col-span-3">
        {isLoading ? <FilingTimelineSkeleton /> : <FilingTimeline />}
        {!isLoading && <FilingComments />}
      </div>
    </div>
  );
};
