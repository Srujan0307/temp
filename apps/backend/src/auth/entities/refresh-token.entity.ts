
import { Model } from 'objection';
import { join } from 'path';

export class RefreshToken extends Model {
  static tableName = 'refresh_tokens';

  id!: number;
  token!: string;
  userId!: number;
  expiresAt!: string;
  isRevoked!: boolean;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, '../users/user.entity'),
      join: {
        from: 'refresh_tokens.userId',
        to: 'users.id',
      },
    },
  };
}
