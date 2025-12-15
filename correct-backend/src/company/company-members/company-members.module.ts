import { Module } from '@nestjs/common';
import { CompanyMembersService } from './company-members.service';
import { companyMembersProviders } from './company-members.provider';
import { CompanyMembersController } from './company-members.controller';

@Module({
  providers: [CompanyMembersService, ...companyMembersProviders],
  exports: [CompanyMembersService],
  controllers: [CompanyMembersController],
})
export class CompanyMembersModule {}
