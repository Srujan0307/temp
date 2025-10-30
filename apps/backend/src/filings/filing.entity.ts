
export class Filing {
  id: number;
  tenant_id: number;
  client_id: number;
  vehicle_id: number;
  status_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
