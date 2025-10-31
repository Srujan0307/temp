import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/Tabs';
import OverviewTab from './tabs/OverviewTab';
import DocumentsTab from './tabs/DocumentsTab';
import CommentsTab from './tabs/CommentsTab';
import HistoryTab from './tabs/HistoryTab';
import WorkflowTab from './tabs/WorkflowTab';

const FilingDetail = () => {
  return (
    <div>
      <h1>Filing Detail</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsTab />
        </TabsContent>
        <TabsContent value="comments">
          <CommentsTab />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
        <TabsContent value="workflow">
          <WorkflowTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilingDetail;