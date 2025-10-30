
import { Model } from 'objection';
import { join } from 'path';

export class User extends Model {
  static tableName = 'users';

  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  tenantId!: number;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;

  static relationMappings = {
    tenant: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'tenant.entity'),
      join: {
        from: 'users.tenantId',
        to: 'tenants.id',
      },
    },
  };
}
