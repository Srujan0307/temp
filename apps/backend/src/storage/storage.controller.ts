import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  Get,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { FileValidationPipe } from './file-validation.pipe';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(FileValidationPipe)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('tenantId') tenantId: string,
    @Query('clientId') clientId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!tenantId) {
      throw new BadRequestException('tenantId is required');
    }
    return this.storageService.upload(
      file,
      parseInt(tenantId, 10),
      clientId ? parseInt(clientId, 10) : undefined,
    );
  }

  @Get('download/:id')
  async getDownloadUrl(@Param('id') id: string) {
    // In a real app, you'd get the s3Key from the database based on the file ID
    // and check for permissions.
    const fileObject = await this.storageService.getFileObject(parseInt(id, 10));
    return this.storageService.getDownloadUrl(fileObject.s3Key);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.storageService.delete(parseInt(id, 10));
  }

  @Post('override-quarantine/:id')
  async overrideQuarantine(@Param('id') id: string) {
    // Placeholder for manual override
    return { message: `File ${id} quarantine override placeholder` };
  }
}
