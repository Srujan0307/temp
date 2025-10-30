import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import storageConfig from './storage.config';
import clamavConfig from './clamav.config';
import { FileObject, FileStatus } from './entities/file-object.entity';
import { S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ModelClass } from 'objection';

const mockS3Client = {
  send: jest.fn(),
};

const mockClamScanner = {
  scanStream: jest.fn(),
};

const mockFileObjectModel = {
  query: jest.fn(() => ({
    insert: jest.fn().mockReturnThis(),
    patchAndFetchById: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    deleteById: jest.fn().mockReturnThis(),
  })),
};

describe('StorageService', () => {
  let service: StorageService;
  let fileObjectModel: ModelClass<FileObject>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: storageConfig.KEY,
          useValue: {
            maxFileSize: 10485760,
            allowedMimeTypes: ['image/jpeg', 'image/png'],
            bucket: 'test-bucket',
          },
        },
        {
          provide: clamavConfig.KEY,
          useValue: {},
        },
        {
          provide: 'FileObjectModel',
          useValue: mockFileObjectModel,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    fileObjectModel = module.get<ModelClass<FileObject>>('FileObjectModel');

    (service as any).s3Client = mockS3Client;
    (service as any).clamScanner = mockClamScanner;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1000,
      buffer: Buffer.from('test'),
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };

    it('should upload a clean file', async () => {
      const insertedFile = { id: 1, status: FileStatus.PENDING_SCAN };
      (fileObjectModel.query().insert as jest.Mock).mockResolvedValue(insertedFile);
      mockClamScanner.scanStream.mockImplementation((stream, cb) => cb(null, null, false, []));
      (fileObjectModel.query().patchAndFetchById as jest.Mock).mockResolvedValue({ ...insertedFile, status: FileStatus.CLEAN });

      const result = await service.upload(file, 1);

      expect(result.status).toBe(FileStatus.CLEAN);
      expect(mockS3Client.send).toHaveBeenCalledTimes(1);
    });

    it('should quarantine an infected file', async () => {
        const insertedFile = { id: 1, status: FileStatus.PENDING_SCAN };
        (fileObjectModel.query().insert as jest.Mock).mockResolvedValue(insertedFile);
        mockClamScanner.scanStream.mockImplementation((stream, cb) => cb(null, null, true, ['EICAR-Test-File']));
        (fileObjectModel.query().patchAndFetchById as jest.Mock).mockResolvedValue({ ...insertedFile, status: FileStatus.QUARANTINED });
  
        const result = await service.upload(file, 1);
  
        expect(result.status).toBe(FileStatus.QUARANTINED);
    });

    it('should throw an error for a large file', async () => {
      await expect(service.upload({ ...file, size: 99999999 }, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error for an invalid mime type', async () => {
      await expect(
        service.upload({ ...file, mimetype: 'application/pdf' }, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle S3 upload errors', async () => {
        const insertedFile = { id: 1, status: FileStatus.PENDING_SCAN };
        (fileObjectModel.query().insert as jest.Mock).mockResolvedValue(insertedFile);
        mockS3Client.send.mockRejectedValue(new Error('S3 Error'));
  
        await expect(service.upload(file, 1)).rejects.toThrow(InternalServerErrorException);
        expect(fileObjectModel.query().deleteById).toHaveBeenCalledWith(1);
    });
  });
});
