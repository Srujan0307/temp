import { Model } from 'objection';
import { User } from './user.entity';

export class Role extends Model {
  static tableName = 'user_roles';

  id!: number;
  userId!: number;
  role!: string;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'user_roles.userId',
        to: 'users.id',
      },
    },
  };
}
