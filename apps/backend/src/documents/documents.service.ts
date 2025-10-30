
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly storageService: StorageService,
  ) {}

  async upload(
    file: Express.Multer.File,
    filingId: number,
    tenantId: number,
  ): Promise<any> {
    const fileObject = await this.storageService.upload(file, tenantId);

    const latestVersion = await this.knex('filing_docs')
      .where({ filing_id: filingId })
      .max('version as max_version')
      .first();

    const newVersion = latestVersion.max_version ? latestVersion.max_version + 1 : 1;

    const [filingDoc] = await this.knex('filing_docs')
      .insert({
        filing_id: filingId,
        file_object_id: fileObject.id,
        version: newVersion,
        tenant_id: tenantId,
      })
      .returning('*');

    return filingDoc;
  }

  async getDownloadUrl(filingDocId: number, tenantId: number): Promise<string> {
    const filingDoc = await this.knex('filing_docs')
      .where({ id: filingDocId, tenant_id: tenantId })
      .first();

    if (!filingDoc) {
      throw new Error('Document not found');
    }

    const fileObject = await this.storageService.getFileObject(filingDoc.file_object_id);

    // Audit log
    await this.knex('audit_events').insert({
      tenant_id: tenantId,
      user_id: null, // TODO: Get user id from context
      event_name: 'document_download',
      event_details: `User downloaded document with id ${filingDocId}`,
    });

    return this.storageService.getDownloadUrl(fileObject.s3Key);
  }

  async list(filingId: number, tenantId: number): Promise<any> {
    return this.knex('filing_docs')
      .where({ filing_id: filingId, tenant_id: tenantId })
      .join('file_objects', 'filing_docs.file_object_id', 'file_objects.id')
      .select(
        'filing_docs.id',
        'filing_docs.version',
        'file_objects.file_name',
        'file_objects.mime_type',
        'file_objects.size',
        'file_objects.status',
        'filing_docs.created_at',
      );
  }

  async delete(filingDocId: number, tenantId: number): Promise<void> {
    const filingDoc = await this.knex('filing_docs')
      .where({ id: filingDocId, tenant_id: tenantId })
      .first();

    if (!filingDoc) {
      throw new Error('Document not found');
    }

    await this.storageService.delete(filingDoc.file_object_id);
    await this.knex('filing_docs').where({ id: filingDocId }).delete();

    // Audit log
    await this.knex('audit_events').insert({
      tenant_id: tenantId,
      user_id: null, // TODO: Get user id from context
      event_name: 'document_delete',
      event_details: `User deleted document with id ${filingDocId}`,
    });
  }
}
