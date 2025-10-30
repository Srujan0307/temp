
import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import config from '../../knexfile';

@Module({
  imports: [
    KnexModule.forRoot({
      config: config.development,
    }),
  ],
  exports: [KnexModule],
})
export class DatabaseModule {}
