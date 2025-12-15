import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenaiService } from './openai/openai.service';
import { OpenaiModule } from './openai/openai.module';
import { VaultModule } from './vault/vault.module';
import { ConversationModule } from './conversation/conversation.module';
import { CompanyModule } from './company/company.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ComplianceModule } from './company/compliance/compliance.module';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import { N8nService } from './n8n/n8n.service';
import { N8nModule } from './n8n/n8n.module';
import { OtpService } from './otp/otp.service';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { RolesModule } from './roles/roles.module';
import { NotificationModule } from './notification/notification.module';
import { CACHE_TTL, CACHE_MAX_ITEMS } from './core/constants';
import { BullModule } from '@nestjs/bullmq';
import { QdrantModule } from './qdrant/qdrant.module';
import { ExtractionService } from './extraction/extraction.service';
import { MastraModule } from './mastra/mastra.module';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: CACHE_TTL,
      max: CACHE_MAX_ITEMS,
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'document-indexing',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL'),
          genReqId: (request) =>
            request.headers['x-correlation-id'] || uuidv4(),
        },
      }),
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CompanyModule,
    UserModule,
    AuthModule,
    OpenaiModule,
    ComplianceModule,
    VaultModule,
    ConversationModule,
    SubscriptionModule,
    N8nModule,
    AdminModule,
    HealthModule,
    RolesModule,
    NotificationModule,
    QdrantModule,
    MastraModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenaiService, N8nService, OtpService, ExtractionService],
})
export class AppModule {}
