import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';

import { Column } from './Column';
import { FILING_STAGES } from './types';

import type { Filing, FilingStage } from './types';

const initialFilings: Filing[] = [
  { id: '1', name: 'Filing 1', stage: 'new' },
  { id: '2', name: 'Filing 2', stage: 'new' },
  { id: '3', name: 'Filing 3', stage: 'in-progress' },
  { id: '4', name: 'Filing 4', stage: 'review' },
  { id: '5', name: 'Filing 5', stage: 'done' },
];

export function FilingsBoard() {
  const [filings, setFilings] = useState(initialFilings);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }) {
    if (active.id !== over.id) {
      const activeFiling = filings.find(({ id }) => id === active.id);
      const overFiling = filings.find(({ id }) => id === over.id);

      if (!activeFiling || !overFiling) {
        return;
      }

      const activeIndex = filings.indexOf(activeFiling);
      const overIndex = filings.indexOf(overFiling);

      const newFilings = [...filings];
      newFilings[activeIndex] = {
        ...activeFiling,
        stage: overFiling.stage,
      };

      setFilings(newFilings);
    }
  }

  function handleDragOver({ active, over }) {
    if (active.id.startsWith('filing-') && over.id.startsWith('column-')) {
      const filingId = active.id.split('-')[1];
      const columnId = over.id.split('-')[1] as FilingStage;

      const newFilings = filings.map((filing) => {
        if (filing.id === filingId) {
          return { ...filing, stage: columnId };
        }

        return filing;
      });

      setFilings(newFilings);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="grid grid-cols-7 gap-4">
        {FILING_STAGES.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            filings={filings.filter((filing) => filing.stage === stage)}
          />
        ))}
      </div>
    </DndContext>
  );
}
