import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { ChecklistModule } from './checklist/checklist.module';
import { complianceProvider } from './compliance.provider';
import { TasksModule } from './tasks/tasks.module';
import { SupabaseModule } from '@/supabase/supabase.module';
import { DocumentModule } from '@/vault/document/document.module';

@Module({
  controllers: [ComplianceController],
  providers: [ComplianceService, ...complianceProvider],
  imports: [ChecklistModule, TasksModule, SupabaseModule, DocumentModule],
})
export class ComplianceModule {}
