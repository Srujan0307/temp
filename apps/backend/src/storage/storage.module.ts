import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { ConfigModule } from '@nestjs/config';
import storageConfig from './storage.config';
import clamavConfig from './clamav.config';
import { FileObject } from './entities/file-object.entity';

@Module({
  imports: [
    ConfigModule.forFeature(storageConfig),
    ConfigModule.forFeature(clamavConfig),
  ],
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: 'FileObjectModel',
      useValue: FileObject,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
