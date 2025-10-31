import { Model } from 'objection';
import { Client } from '../clients/client.entity';

export class Vehicle extends Model {
  static tableName = 'vehicles';

  id!: number;
  tenant_id!: number;
  client_id!: number;
  name!: string;
  vin!: string;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  client?: Client;
}
