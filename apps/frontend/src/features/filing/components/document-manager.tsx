
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MoreVertical, Trash2, Download, Star } from 'lucide-react';

import { useDocuments } from '../hooks/use-documents';
import { Uploader } from './uploader/uploader';
import { UploadQueue } from './uploader/upload-queue';
import { ConfirmDeleteDialog } from './dialogs/confirm-delete-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DocumentManager() {
  const { filingId } = useParams<{ filingId: string }>();
  const { documents, uploadDocument, deleteDocument, isLoading } = useDocuments(
    filingId,
  );
  const [uploads, setUploads] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleUpload = (files: File[]) => {
    files.forEach((file) => {
      uploadDocument(file);
    });
  };
  const handleCancel = (file: File) => {
    console.log(file);
  };
  const handleRetry = (file: File) => {
    console.log(file);
  };

  const handleDelete = (documentId: string) => {
    deleteDocument(documentId);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
        <Uploader onUpload={handleUpload} />
        <UploadQueue
          uploads={uploads}
          onCancel={handleCancel}
          onRetry={handleRetry}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Documents</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Uploaded by</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Virus Scan</TableHead>
              <TableHead>Size</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              documents?.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === 'available' ? 'success' : 'secondary'
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          Set as primary
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDocument(doc.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => handleDelete(selectedDocument)}
      />
    </div>
  );
}
