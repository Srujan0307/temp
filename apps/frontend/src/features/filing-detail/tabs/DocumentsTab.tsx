import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DocumentsTab = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Documents</h2>
        <div className="flex items-center space-x-2">
          <Input type="file" />
          <Button>Upload</Button>
        </div>
      </div>
      <Table>
        <TableCaption>A list of documents related to this filing.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Uploaded Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>document1.pdf</TableCell>
            <TableCell>1.0</TableCell>
            <TableCell>2023-10-31</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                Preview
              </Button>
              <Button variant="outline" size="sm" className="ml-2">
                Download
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTab;
