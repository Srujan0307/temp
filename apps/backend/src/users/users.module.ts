import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { InvitesModule } from './invites.module';

@Module({
  imports: [InvitesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserModel',
      useValue: User,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
