import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '@/user/user.module';
import { CompanyModule } from '@/company/company.module';
import { VaultModule } from '@/vault/vault.module';
import { FolderModule } from '@/vault/folder/folder.module';
import { ConversationModule } from '@/conversation/conversation.module';
import { DocumentModule } from '@/vault/document/document.module';
import { ChecklistModule } from '@/company/compliance/checklist/checklist.module';
import { ComplianceModule } from '@/company/compliance/compliance.module';
import { CompanyMembersModule } from '@/company/company-members/company-members.module';
import { adminProviders } from './admin.provider';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ...adminProviders],
  imports: [
    CompanyModule,
    UserModule,
    VaultModule,
    ConversationModule,
    FolderModule,
    DocumentModule,
    ChecklistModule,
    CompanyMembersModule,
    ComplianceModule,
  ],
})
export class AdminModule {}
