import { Inject, Injectable } from '@nestjs/common';
import { UserInvite } from './user-invite.entity';
import { ModelClass } from 'objection';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitesService {
  constructor(
    @Inject('UserInviteModel')
    private userInviteModel: ModelClass<UserInvite>,
  ) {}

  async create(email: string, role: string, tenantId: number): Promise<UserInvite> {
    const token = randomBytes(32).toString('hex');

    const invite = await this.userInviteModel.query().insertAndFetch({
      email,
      role,
      tenantId,
      token,
    });

    // TODO: send email

    return invite;
  }
}
