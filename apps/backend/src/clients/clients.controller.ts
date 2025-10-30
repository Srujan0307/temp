import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AssignUserDto } from './dto/assign-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/roles.decorator';
import { Role } from '../users/role.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.Admin, Role.Manager)
  create(@Request() req, @Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(req.user.tenantId, createClientDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.clientsService.findAll(
      req.user.tenantId,
      page,
      limit,
      search,
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.clientsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Manager)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, req.user.tenantId, updateClientDto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Request() req, @Param('id') id: string) {
    return this.clientsService.remove(id, req.user.tenantId);
  }

  @Post(':id/logo')
  @Roles(Role.Admin, Role.Manager)
  @UseInterceptors(FileInterceptor('file'))
  uploadLogo(
    @Request() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.clientsService.uploadLogo(id, req.user.tenantId, file);
  }

  @Get(':id/logo')
  getLogo(@Request() req, @Param('id') id: string) {
    return this.clientsService.getLogoUrl(id, req.user.tenantId);
  }

  @Post(':id/assign-user')
  @Roles(Role.Admin, Role.Manager)
  assignUser(
    @Request() req,
    @Param('id') id: string,
    @Body() assignUserDto: AssignUserDto,
  ) {
    return this.clientsService.assignUser(
      id,
      req.user.tenantId,
      assignUserDto.userId,
    );
  }

  @Delete(':id/unassign-user/:userId')
  @Roles(Role.Admin, Role.Manager)
  unassignUser(
    @Request() req,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.clientsService.unassignUser(id, req.user.tenantId, userId);
  }
}
