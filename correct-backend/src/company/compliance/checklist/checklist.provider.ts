import {
  CHECKLIST_REPOSITORY,
  COMPLIANCE_REPOSITORY,
  COMPANY_TASK_REPOSITORY,
  TASK_REPOSITORY,
} from '@/core/constants';
import { CompanyChecklist } from '../entities/companyChecklist.entity';
import { ComplianceTask } from '../entities/task.entity';
import { Compliance } from '../entities/compliance.entity';
import { CompanyComplianceTask } from '../entities/companyTask.entity';

export const checklistProviders = [
  {
    provide: CHECKLIST_REPOSITORY,
    useValue: CompanyChecklist,
  },
  {
    provide: TASK_REPOSITORY,
    useValue: ComplianceTask,
  },
  {
    provide: COMPLIANCE_REPOSITORY,
    useValue: Compliance,
  },
  {
    provide: COMPANY_TASK_REPOSITORY,
    useValue: CompanyComplianceTask,
  },
];
