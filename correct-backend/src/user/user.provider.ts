import { CompanyDetails } from '@/company/entities/company.entity';
import { User } from './entity/user.entity';
import { CompanyMember } from '@/company/entities/company-members.entity';
import {
  COMPANY_REPOSITORY,
  USER_REPOSITORY,
  COMPANY_MEMBER_REPOSITORY,
} from '@/core/constants';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: COMPANY_REPOSITORY,
    useValue: CompanyDetails,
  },
  {
    provide: COMPANY_MEMBER_REPOSITORY,
    useValue: CompanyMember,
  },
];
