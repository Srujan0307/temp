import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';
import { ContextMiddleware } from './common/middleware/context.middleware';
import { ContextModule } from './common/context/context.module';
import { LoggerModule } from 'nestjs-pino';
import { ContextService } from './common/context/context.service';
import { APP_GUARD } from '@nestjs/core';
import { TenancyModule } from './tenancy/tenancy.module';
import { TenancyGuard } from './tenancy/tenancy.guard';
import { TenancyMiddleware } from './tenancy/tenancy.middleware';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { DocumentsModule } from './documents/documents.module';
import { FilingsModule } from './filings/filings.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
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
    AuthModule,
    UsersModule,
    ClientsModule,
    DocumentsModule,
    FilingsModule,
    VehiclesModule,
    CalendarModule,
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
