import { CompanyMember } from './entities/company-members.entity';
import { CompanyDetails } from './entities/company.entity';

import {
  COMPANY_MEMBER_REPOSITORY,
  COMPANY_REPOSITORY,
} from '@/core/constants';

export const companyProviders = [
  {
    provide: COMPANY_REPOSITORY,
    useValue: CompanyDetails,
  },
  {
    provide: COMPANY_MEMBER_REPOSITORY,
    useValue: CompanyMember,
  },
];
