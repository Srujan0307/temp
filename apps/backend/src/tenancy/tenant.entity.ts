
import { Model } from 'objection';
import { join } from 'path';

export class Tenant extends Model {
  static tableName = 'tenants';

  id!: number;
  name!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;

  static relationMappings = {
    users: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, '../users/user.entity'),
      join: {
        from: 'tenants.id',
        to: 'users.tenantId',
      },
    },
  };
}
