import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';
import { ContextMiddleware } from './common/middleware/context.middleware';
import { ContextModule } from './common/context/context.module';
import { LoggerModule } from 'nestjs-pino';
import { ContextService } from './common/context/context.service';
import { APP_GUARD } from '@nestjs/core';
import { TenancyModule } from 'apps/backend/tenancy/tenancy.module';
import { TenancyGuard } from 'apps/backend/tenancy/tenancy.guard';
import { TenancyMiddleware } from 'apps/backend/tenancy/tenancy.middleware';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContextModule,
    LoggerModule.forRootAsync({
      imports: [ContextModule],
      inject: [ContextService],
      useFactory: (contextService: ContextService) => ({
        pinoHttp: {
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV !== 'production'
              ? { target: 'pino-pretty' }
              : undefined,
          customProps: () => ({
            correlationId: contextService.correlationId,
            tenantId: contextService.tenantId,
            userId: contextService.userId,
          }),
        },
      }),
    }),
    TenancyModule,
    DatabaseModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenancyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware, TenancyMiddleware).forRoutes('*');
  }
}
