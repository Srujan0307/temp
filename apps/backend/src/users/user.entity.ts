
import { Model } from 'objection';
import { join } from 'path';
import { Role } from './role.entity';

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

  roles?: Role[];

  static relationMappings = {
    tenant: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, '..', 'tenancy', 'tenant.entity'),
      join: {
        from: 'users.tenantId',
        to: 'tenants.id',
      },
    },
    roles: {
      relation: Model.HasManyRelation,
      modelClass: Role,
      join: {
        from: 'users.id',
        to: 'user_roles.userId',
      },
    },
  };
}
