import {
  COMPLIANCE_REPOSITORY,
  TASK_REPOSITORY,
  DOCUMENT_REPOSITORY,
  COMPANY_TASK_DOCUMENT_REPOSITORY,
  COMPLIANCE_DOCUMENT_REPOSITORY,
} from '@/core/constants';
import { Compliance } from './entities/compliance.entity';
import { ComplianceTask } from './entities/task.entity';
import { Document } from '@/vault/entities/document.entity';
import { ComplianceDocument } from './entities/compliance-document.entity';
import { CompanyTaskDocument } from './entities/company-task-document.entity';

export const complianceProvider = [
  {
    provide: COMPLIANCE_REPOSITORY,
    useValue: Compliance,
  },
  {
    provide: TASK_REPOSITORY,
    useValue: ComplianceTask,
  },
  {
    provide: DOCUMENT_REPOSITORY,
    useValue: Document,
  },
  {
    provide: COMPLIANCE_DOCUMENT_REPOSITORY,
    useValue: ComplianceDocument,
  },
  {
    provide: COMPANY_TASK_DOCUMENT_REPOSITORY,
    useValue: CompanyTaskDocument,
  },
];
