import {
  COMPANY_REPOSITORY,
  USER_REPOSITORY,
  CONVERSATION_REPOSITORY,
  DOCUMENT_REPOSITORY,
  FOLDER_REPOSITORY,
  COMPANY_MEMBER_REPOSITORY,
  CHECKLIST_REPOSITORY,
  ROLE_REPOSITORY,
  ADMIN_REPOSITORY,
  ADMIN_ROLE_REPOSITORY,
  TASK_REPOSITORY,
  COMPANY_TASK_REPOSITORY,
} from '@/core/constants';
import { CompanyMember } from '@/company/entities/company-members.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { User } from '@/user/entity/user.entity';
import { Conversation } from '@/conversation/entities/conversation.entity';
import { Folder } from '@/vault/entities/folder.entity';
import { Document } from '@/vault/entities/document.entity';
import { CompanyChecklist } from '@/company/compliance/entities/companyChecklist.entity';
import { Role } from '../roles/entities/role.entity';
import { Admin } from './entities/admin.entity';
import { AdminRole } from './entities/admin-roles.entity';
import { CompanyComplianceTask } from '@/company/compliance/entities/companyTask.entity';
import { ComplianceTask } from '@/company/compliance/entities/task.entity';

export const adminProviders = [
  {
    provide: COMPANY_REPOSITORY,
    useValue: CompanyDetails,
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: CONVERSATION_REPOSITORY,
    useValue: Conversation,
  },
  {
    provide: FOLDER_REPOSITORY,
    useValue: Folder,
  },
  {
    provide: DOCUMENT_REPOSITORY,
    useValue: Document,
  },
  {
    provide: COMPANY_MEMBER_REPOSITORY,
    useValue: CompanyMember,
  },
  {
    provide: CHECKLIST_REPOSITORY,
    useValue: CompanyChecklist,
  },
  {
    provide: ROLE_REPOSITORY,
    useValue: Role,
  },
  {
    provide: ADMIN_REPOSITORY,
    useValue: Admin,
  },
  {
    provide: ADMIN_ROLE_REPOSITORY,
    useValue: AdminRole,
  },
  {
    provide: TASK_REPOSITORY,
    useValue: ComplianceTask,
  },
  {
    provide: COMPANY_TASK_REPOSITORY,
    useValue: CompanyComplianceTask,
  },
];
