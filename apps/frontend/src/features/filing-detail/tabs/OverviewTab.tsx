import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const OverviewTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Filing Metadata</CardTitle>
            <CardDescription>Details about the filing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Filing ID</p>
                <p>12345</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>In Progress</p>
              </div>
              <div>
                <p className="font-semibold">Created Date</p>
                <p>2023-10-31</p>
              </div>
              <div>
                <p className="font-semibold">Last Updated</p>
                <p>2023-10-31</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Assignees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-muted-foreground">Lead</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>SLA Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p>SLA: 5 days remaining</p>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Stage Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button>Approve</Button>
            <Button variant="destructive" className="ml-2">
              Reject
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
