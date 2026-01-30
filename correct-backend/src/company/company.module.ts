import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { companyProviders } from './company.provider';
import { CompanyMembersModule } from './company-members/company-members.module';
import { UserModule } from '@/user/user.module';
import { DinModule } from './din/din.module';
import { DocumentModule } from '@/vault/document/document.module';
@Module({
  controllers: [CompanyController],
  providers: [CompanyService, ...companyProviders],
  exports: [CompanyService, ...companyProviders],
  imports: [CompanyMembersModule, UserModule, DinModule, DocumentModule],
})
export class CompanyModule {}
