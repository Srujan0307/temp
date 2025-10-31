
import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { ModelClass } from 'objection';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('UserModel') private userModel: ModelClass<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, firstName, lastName } = createUserDto;
    // TODO: hash password
    const password = Math.random().toString(36).slice(-8);
    // TODO: get tenantId from context
    const tenantId = 1;

    return this.userModel.query().insertAndFetch({
      email,
      firstName,
      lastName,
      password,
      tenantId,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.query();
  }

  async findOne(email: string, tenantId: number): Promise<User | undefined> {
    return this.userModel.query().where({ email, tenantId }).first();
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userModel.query().findById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.query().patchAndFetchById(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.userModel.query().deleteById(id);
  }
}
