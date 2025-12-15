import { COMPANY_MEMBER_REPOSITORY } from '@/core/constants';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CompanyMember } from '../entities/company-members.entity';
import { CreateCompanyMembersDto } from '../dto/company-member.dto';
import { CompanyDetails } from '../entities/company.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '@/user/entity/user.entity';

@Injectable()
export class CompanyMembersService {
  private readonly logger = new Logger(CompanyMembersService.name);
  constructor(
    @Inject(COMPANY_MEMBER_REPOSITORY)
    private readonly companyMemberRepository: typeof CompanyMember,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createCompanyMembersDto: CreateCompanyMembersDto) {
    const response = this.companyMemberRepository.create<CompanyMember>(
      createCompanyMembersDto,
    );

    if (!response) {
      this.logger.error(
        'Company member not created',
        'create',
        'CompanyMembersService',
      );
      throw new BadRequestException('Company member not created');
    }
    return response;
  }
  async findAll(conditions: { [key: string]: any }) {
    const cacheKey = `company_members_${conditions.userId}`;
    const cachedCompanyMembers =
      await this.cacheManager.get<CompanyMember[]>(cacheKey);
    if (cachedCompanyMembers) {
      this.logger.log('Company members found in cache:', cachedCompanyMembers);
      return cachedCompanyMembers;
    } else {
      const response =
        await this.companyMemberRepository.findAll<CompanyMember>({
          where: {
            userId: conditions.userId,
          },
          include: [CompanyDetails],
        });
      if (!response) {
        this.logger.error(
          'Company Members not found',
          'findAll',
          'CompanyMembersService',
        );
        throw new BadRequestException(
          `Company Members with ${conditions} not found`,
        );
      }
      await this.cacheManager.set(cacheKey, response);
      return response;
    }
  }

  async findAllMembers(conditions: { [key: string]: any }) {
    const response = await this.companyMemberRepository.findAll<
      CompanyMember & { user: User }
    >({
      where: {
        companyId: conditions.companyId,
      },
      include: [User],
    });
    if (!response) {
      this.logger.error(
        'Company members not found',
        'findAllMembers',
        'CompanyMembersService',
      );
      throw new BadRequestException('Company members not found');
    }
    return response;
  }

  async findOne(condition: { [key: string]: any }) {
    let whereConditions = {};
    if (condition) {
      whereConditions = { where: { ...condition } };
    }
    console.log(whereConditions);
    const found =
      this.companyMemberRepository.findOne<CompanyMember>(whereConditions);
    if (!found) {
      this.logger.error(
        'Company member not found',
        'findOne',
        'CompanyMembersService',
      );
      throw new NotFoundException('Company member not found');
    }
    return found;
  }

  async destroy(id: number) {
    const response = await this.companyMemberRepository.destroy({
      where: { id },
    });

    if (!response) {
      this.logger.error(
        `Company member with id ${id} not found`,
        'destroy',
        'CompanyMembersService',
      );
      throw new NotFoundException(`Company member is not found`);
    }
    return response;
  }
  async update(condition: { [key: string]: any }, payload: any) {
    const response = await this.companyMemberRepository.update(
      { ...payload },
      { where: { ...condition } },
    );
    if (!response) {
      throw new BadRequestException('Company member not updated');
    }
    return response;
  }
}
