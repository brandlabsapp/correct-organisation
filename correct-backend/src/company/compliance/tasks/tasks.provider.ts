import {
  COMPANY_MEMBER_REPOSITORY,
  COMPANY_TASK_REPOSITORY,
  COMPANY_TASK_DOCUMENT_REPOSITORY,
  DOCUMENT_REPOSITORY,
  TASK_REPOSITORY,
} from '@/core/constants';
import { ComplianceTask } from '../entities/task.entity';
import { CompanyComplianceTask } from '../entities/companyTask.entity';
import { Document } from '@/vault/entities/document.entity';
import { CompanyMember } from '@/company/entities/company-members.entity';
import { CompanyTaskDocument } from '../entities/company-task-document.entity';

export const taskProviders = [
  {
    provide: TASK_REPOSITORY,
    useValue: ComplianceTask,
  },
  {
    provide: COMPANY_TASK_REPOSITORY,
    useValue: CompanyComplianceTask,
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
    provide: COMPANY_TASK_DOCUMENT_REPOSITORY,
    useValue: CompanyTaskDocument,
  },
];
