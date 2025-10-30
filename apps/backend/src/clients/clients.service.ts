import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { UserAssignment } from './user-assignment.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(UserAssignment)
    private userAssignmentsRepository: Repository<UserAssignment>,
    private storageService: StorageService,
    private usersService: UsersService,
  ) {}

  findAll(tenantId: string, page = 1, limit = 10, search?: string) {
    const query = this.clientsRepository
      .createQueryBuilder('client')
      .where('client.tenantId = :tenantId', { tenantId });

    if (search) {
      query.andWhere('client.name ILIKE :search', { search: `%${search}%` });
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findOne(id: string, tenantId: string) {
    const client = await this.clientsRepository.findOne({
      where: { id, tenantId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  create(tenantId: string, createClientDto: CreateClientDto) {
    const client = this.clientsRepository.create({
      ...createClientDto,
      tenantId,
    });
    return this.clientsRepository.save(client);
  }

  async update(id: string, tenantId: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id, tenantId);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string, tenantId: string) {
    const client = await this.findOne(id, tenantId);
    await this.clientsRepository.remove(client);
  }

  async uploadLogo(
    id: string,
    tenantId: string,
    file: Express.Multer.File,
  ) {
    const client = await this.findOne(id, tenantId);
    const logo = await this.storageService.uploadFile(
      file,
      `tenants/${tenantId}/clients/${id}`,
    );
    client.logoId = logo.id;
    await this.clientsRepository.save(client);
    return this.storageService.getSignedUrl(logo.key);
  }

  async getLogoUrl(id: string, tenantId: string) {
    const client = await this.findOne(id, tenantId);
    if (!client.logoId) {
      throw new NotFoundException('Logo not found for this client');
    }
    const logo = await this.storageService.getFile(client.logoId);
    return this.storageService.getSignedUrl(logo.key);
  }

  async assignUser(id: string, tenantId: string, userId: string) {
    const client = await this.findOne(id, tenantId);
    const user = await this.usersService.findOne(userId, tenantId);

    const existingAssignment = await this.userAssignmentsRepository.findOne({
      where: { clientId: client.id, userId: user.id },
    });

    if (existingAssignment) {
      return existingAssignment;
    }

    const assignment = this.userAssignmentsRepository.create({
      clientId: client.id,
      userId: user.id,
    });
    return this.userAssignmentsRepository.save(assignment);
  }

  async unassignUser(id: string, tenantId: string, userId: string) {
    const client = await this.findOne(id, tenantId);
    const user = await this.usersService.findOne(userId, tenantId);
    const assignment = await this.userAssignmentsRepository.findOne({
      where: { clientId: client.id, userId: user.id },
    });
    if (!assignment) {
      throw new NotFoundException('User assignment not found');
    }
    await this.userAssignmentsRepository.remove(assignment);
  }
}
