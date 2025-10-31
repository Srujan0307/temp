import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

import { Card } from './Card';

import type { Filing, FilingStage } from './types';

interface ColumnProps {
  stage: FilingStage;
  filings: Filing[];
}

export function Column({ stage, filings }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `column-${stage}`,
  });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">{stage}</h2>
      <SortableContext
        items={filings.map((filing) => `filing-${filing.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {filings.map((filing) => (
            <Card key={filing.id} filing={filing} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
