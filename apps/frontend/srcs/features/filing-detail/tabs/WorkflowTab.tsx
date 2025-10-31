import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const WorkflowTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Workflow</h2>
      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Workflow information will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowTab;
