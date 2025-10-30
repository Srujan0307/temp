import { Model } from 'objection';

export class UserInvite extends Model {
  static tableName = 'user_invites';

  id!: number;
  email!: string;
  role!: string;
  tenantId!: number;
  token!: string;
}
