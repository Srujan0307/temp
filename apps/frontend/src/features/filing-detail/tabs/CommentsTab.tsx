import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

const CommentsTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
          </CardHeader>
          <CardContent>
            <p>This is a comment.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Add a comment</h3>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Type your comment here." />
          </CardContent>
          <CardFooter>
            <Button>Post Comment</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CommentsTab;
