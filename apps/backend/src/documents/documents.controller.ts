
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { TenancyService } from '../tenancy/tenancy.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly tenancyService: TenancyService,
  ) {}

  @Post('upload/:filingId')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('filingId') filingId: number,
  ) {
    const tenantId = this.tenancyService.getTenantId();
    return this.documentsService.upload(file, filingId, tenantId);
  }

  @Get('download/:filingDocId')
  download(@Param('filingDocId') filingDocId: number) {
    const tenantId = this.tenancyService.getTenantId();
    return this.documentsService.getDownloadUrl(filingDocId, tenantId);
  }

  @Get('list/:filingId')
  list(@Param('filingId') filingId: number) {
    const tenantId = this.tenancyService.getTenantId();
    return this.documentsService.list(filingId, tenantId);
  }

  @Delete(':filingDocId')
  delete(@Param('filingDocId') filingDocId: number) {
    const tenantId = this.tenancyService.getTenantId();
    return this.documentsService.delete(filingDocId, tenantId);
  }
}
