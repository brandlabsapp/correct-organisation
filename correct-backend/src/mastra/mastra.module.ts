import { Module } from '@nestjs/common';
import { MastraService } from './mastra.service';
import { MastraController } from './mastra.controller';
import { CompanyModule } from '@/company/company.module';
import { companyProviders } from '@/company/company.provider';
@Module({
  controllers: [MastraController],
  providers: [MastraService, ...companyProviders],
  imports: [CompanyModule],
})
export class MastraModule {}
