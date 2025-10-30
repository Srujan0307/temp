import { Injectable, Inject, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as ClamScan from 'clamscan';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

import storageConfig from './storage.config';
import clamavConfig from './clamav.config';
import { FileObject, FileStatus } from './entities/file-object.entity';
import { ModelClass } from 'objection';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly clamScanner;

  constructor(
    @Inject(storageConfig.KEY)
    private readonly storageConf: ConfigType<typeof storageConfig>,
    @Inject(clamavConfig.KEY)
    private readonly clamavConf: ConfigType<typeof clamavConfig>,
    @Inject('FileObjectModel')
    private readonly fileObjectModel: ModelClass<FileObject>,
  ) {
    this.s3Client = new S3Client({
      region: this.storageConf.region,
      endpoint: this.storageConf.endpoint,
      credentials: {
        accessKeyId: this.storageConf.accessKeyId,
        secretAccessKey: this.storageConf.secretAccessKey,
      },
    });

    this.clamScanner = new ClamScan({
      removeInfected: false,
      quarantineInfected: false,
      scanLog: null,
      debugMode: false,
      fileList: null,
      scanRecursively: true,
      clamdscan: {
        host: this.clamavConf.host,
        port: this.clamavConf.port,
        timeout: this.clamavConf.timeout,
        socket: null,
        bypassTest: false,
        multiscan: true,
      },
      preference: 'clamdscan',
    });
  }

  async upload(
    file: Express.Multer.File,
    tenantId: number,
    clientId?: number,
  ): Promise<FileObject> {
    this.validateFile(file);

    const s3Key = this.generateS3Key(tenantId, file.originalname, clientId);

    const fileObject = await this.fileObjectModel.query().insert({
      fileName: file.originalname,
      s3Key,
      mimeType: file.mimetype,
      size: file.size,
      status: FileStatus.PENDING_SCAN,
      tenantId,
      clientId,
    });

    try {
      await this.uploadToS3(s3Key, file.buffer);
      const scanResult = await this.scanFile(s3Key, file.buffer);

      if (scanResult.isInfected) {
        this.logger.warn(`File ${s3Key} is infected with ${scanResult.viruses.join(', ')}`);
        const quarantinedS3Key = this.quarantineFile(s3Key);
        return await this.updateFileStatus(fileObject.id, FileStatus.QUARANTINED);
      } else {
        this.logger.log(`File ${s3Key} is clean`);
        return await this.updateFileStatus(fileObject.id, FileStatus.CLEAN);
      }
    } catch (error) {
      this.logger.error('Error processing file upload', error);
      await this.deleteFromS3(s3Key);
      await this.fileObjectModel.query().deleteById(fileObject.id);
      throw new InternalServerErrorException('File upload processing failed');
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (file.size > this.storageConf.maxFileSize) {
      throw new BadRequestException('File is too large');
    }
    if (!this.storageConf.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }
  }

  private generateS3Key(
    tenantId: number,
    originalName: string,
    clientId?: number,
  ): string {
    const prefix = clientId
      ? `tenants/${tenantId}/clients/${clientId}`
      : `tenants/${tenantId}`;
    return `${prefix}/${uuidv4()}-${originalName}`;
  }

  private async uploadToS3(s3Key: string, buffer: Buffer): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.storageConf.bucket,
      Key: s3Key,
      Body: buffer,
    });
    await this.s3Client.send(command);
  }

  private async scanFile(
    s3Key: string,
    buffer: Buffer,
  ): Promise<{ isInfected: boolean; viruses: string[] }> {
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    return new Promise((resolve, reject) => {
        this.clamScanner.scanStream(readableStream, (err, file, isInfected, viruses) => {
            if (err) {
                this.logger.error(`Error scanning file ${s3Key}`, err);
                return reject(err);
            }
            resolve({ isInfected, viruses });
        });
    });
  }

  private async updateFileStatus(
    id: number,
    status: FileStatus,
  ): Promise<FileObject> {
    return await this.fileObjectModel.query().patchAndFetchById(id, { status });
  }

  private quarantineFile(s3Key: string): string {
    const quarantinedS3Key = `quarantine/${s3Key}`;
    // In a real scenario, you would move the file in S3.
    // For this example, we'll just log it.
    this.logger.log(`File ${s3Key} moved to ${quarantinedS3Key}`);
    return quarantinedS3Key;
  }

  private async deleteFromS3(s3Key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.storageConf.bucket,
      Key: s3Key,
    });
    await this.s3Client.send(command);
  }

  async getDownloadUrl(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.storageConf.bucket,
      Key: s3Key,
    });
    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async delete(id: number): Promise<void> {
    const fileObject = await this.fileObjectModel.query().findById(id);
    if (!fileObject) {
      throw new BadRequestException('File not found');
    }
    await this.deleteFromS3(fileObject.s3Key);
    await this.fileObjectModel.query().deleteById(id);
  }

  async getFileObject(id: number): Promise<FileObject> {
    const fileObject = await this.fileObjectModel.query().findById(id);
    if (!fileObject) {
      throw new BadRequestException('File not found');
    }
    return fileObject;
  }
}
