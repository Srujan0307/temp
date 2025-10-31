import { Vehicle } from '../vehicles/vehicle.entity';
import { User } from '../users/user.entity';

export enum FilingStage {
  DRAFT = 'Draft',
  IN_REVIEW = 'In Review',
  APPROVED = 'Approved',
  SUBMITTED = 'Submitted',
  ARCHIVED = 'Archived',
}

export enum SlaStatus {
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  OFF_TRACK = 'Off Track',
}

export class Filing {
  id?: number;
  tenant_id?: number;
  client_id?: number;
  vehicle_id?: number;
  type?: string;
  due_date?: Date;
  stage?: FilingStage;
  sla_status?: SlaStatus;
  assigned_to?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  // Relations
  vehicle?: Vehicle;
  assignedTo?: User;
}
