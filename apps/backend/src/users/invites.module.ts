import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { UserInvite } from './user-invite.entity';

@Module({
  providers: [
    InvitesService,
    {
      provide: 'UserInviteModel',
      useValue: UserInvite,
    },
  ],
  exports: [InvitesService],
})
export class InvitesModule {}
