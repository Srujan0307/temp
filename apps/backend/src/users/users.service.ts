
import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { ModelClass } from 'objection';

@Injectable()
export class UsersService {
  constructor(@Inject('UserModel') private userModel: ModelClass<User>) {}

  async findOne(email: string, tenantId: number): Promise<User | undefined> {
    return this.userModel.query().where({ email, tenantId }).first();
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userModel.query().findById(id);
  }
}
