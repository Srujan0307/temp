import { Model } from 'objection';

export enum FileStatus {
  PENDING_SCAN = 'pending_scan',
  CLEAN = 'clean',
  QUARANTINED = 'quarantined',
}

export class FileObject extends Model {
  static tableName = 'file_objects';

  id!: number;
  fileName!: string;
  s3Key!: string;
  mimeType!: string;
  size!: number;
  status!: FileStatus;
  tenantId!: number;
  clientId?: number;
}
