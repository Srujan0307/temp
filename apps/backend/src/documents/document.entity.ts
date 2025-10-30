
export class FileObject {
  id: number;
  file_name: string;
  s3_key: string;
  mime_type: string;
  size: number;
  status: 'pending_scan' | 'clean' | 'quarantined';
  tenant_id: number;
  client_id?: number;
  created_at: Date;
  updated_at: Date;
}

export class FilingDoc {
  id: number;
  filing_id: number;
  file_object_id: number;
  version: number;
  tenant_id: number;
  created_at: Date;
  updated_at: Date;
}
