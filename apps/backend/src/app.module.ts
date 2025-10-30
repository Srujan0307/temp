import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';
import { ContextMiddleware } from './common/middleware/context.middleware';
import { ContextModule } from './common/context/context.module';
import { LoggerModule } from 'nestjs-pino';
import { ContextService } from './common/context/context.service';

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
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
