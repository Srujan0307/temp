import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HistoryTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">History</h2>
      <Card>
        <CardHeader>
          <CardTitle>Filing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Filing Created</p>
              <p className="text-sm text-muted-foreground">by John Doe on 2023-10-31</p>
            </div>
            <div>
              <p className="font-semibold">Document Uploaded</p>
              <p className="text-sm text-muted-foreground">by John Doe on 2023-10-31</p>
            </div>
            <div>
              <p className="font-semibold">Stage Changed</p>
              <p className="text-sm text-muted-foreground">from In Progress to Approved by Jane Doe on 2023-10-31</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryTab;
