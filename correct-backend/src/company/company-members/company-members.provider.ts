import { COMPANY_MEMBER_REPOSITORY } from '@/core/constants';
import { CompanyMember } from '../entities/company-members.entity';

export const companyMembersProviders = [
  {
    provide: COMPANY_MEMBER_REPOSITORY,
    useValue: CompanyMember,
  },
];
