import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyDetails } from './entities/company.entity';
import { COMPANY_REPOSITORY } from '@/core/constants';
import { CompanyMembersService } from './company-members/company-members.service';
import { User } from '@/user/entity/user.entity';
import { CompanyMember } from './entities/company-members.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateCompanyMembersDto } from './dto/company-member.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DocumentService } from '@/vault/document/document.service';
import { Document } from '@/vault/entities/document.entity';
import { CompanyChecklist } from './compliance/entities/companyChecklist.entity';
import { Compliance } from './compliance/entities/compliance.entity';
@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: typeof CompanyDetails,
    private readonly userService: UserService,
    private readonly companyMembersService: CompanyMembersService,
    private readonly documentService: DocumentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const response =
      await this.companyRepository.create<CompanyDetails>(createCompanyDto);

    if (!response) {
      this.logger.error('Company not created', 'create', 'CompanyService');
      throw new BadRequestException('Company not created');
    }

    const companyMember = await this.companyMembersService.create({
      companyId: response.id,
      userId: createCompanyDto.userId,
      status: 'active',
      invitationToken: uuidv4(),
      role: 'admin',
      invitedAt: new Date(),
      acceptedAt: new Date(),
    } as CreateCompanyMembersDto);

    if (!companyMember) {
      this.logger.error(
        'Company member not created',
        'create',
        'CompanyService',
      );
      throw new BadRequestException('Company not created');
    }

    return response;
  }

  async findAll() {
    const cacheKey = `companies`;
    const cachedCompanies =
      await this.cacheManager.get<CompanyDetails[]>(cacheKey);
    if (cachedCompanies) {
      this.logger.log('Companies found in cache:', cachedCompanies);
      return cachedCompanies;
    } else {
      const data = await this.companyRepository.findAll<CompanyDetails>();
      if (!data) {
        this.logger.error('No company found', 'CompanyService', 'findAll');
        throw new NotFoundException('No company found');
      }
      this.logger.log('Companies found');
      await this.cacheManager.set(cacheKey, data);
      return data;
    }
  }

  async findAllByUserId(userId: number) {
    const data = await this.companyRepository.findAll<CompanyDetails>({
      where: { userId: userId },
    });
    if (!data) {
      this.logger.error(
        `Company with ${userId} not found`,
        'findAllByUserId',
        'CompanyService',
      );
      throw new NotFoundException(`Company with ${userId} not found`);
    }
    return data;
  }

  async findOneByUuid(uuid: string) {
    const cacheKey = `company_${uuid}`;
    const cachedCompany = await this.cacheManager.get<CompanyDetails>(cacheKey);

    if (cachedCompany) {
      this.logger.log('Company found in cache:', cachedCompany);
      return cachedCompany;
    } else {
      const found = await this.companyRepository.findOne<CompanyDetails>({
        where: { uuid },
        include: [
          {
            model: CompanyMember,
            include: [User],
          },
          {
            model: Document,
            as: 'documents',
          },
          {
            model: CompanyChecklist,
            include: [
              {
                model: Compliance,
              },
            ],
          },
        ],
      });
      if (!found) {
        this.logger.error('Company not found', 'findOne', 'CompanyService');
        throw new NotFoundException('Company not found');
      }
      this.logger.log('Company found');
      await this.cacheManager.set(cacheKey, found);
      return found;
    }
  }

  async inviteMember(createCompanyMembersDto: CreateCompanyMembersDto) {
    try {
      const payload = {
        ...createCompanyMembersDto,
        invitationToken: uuidv4(),
        invitedAt: new Date(),
        staus: 'pending',
      };
      const invitedUserPhone = createCompanyMembersDto.phone;
      let user = await this.userService.findOneByPhone(invitedUserPhone);
      if (!user) {
        user = await this.userService.create({
          phone: invitedUserPhone,
        });
      }
      payload.userId = user.id;
      const isMemberAlreadyInvited = await this.companyMembersService.findOne({
        companyId: createCompanyMembersDto.companyId,
        userId: user.id,
      });
      console.log('isMemberAlreadyInvited...', isMemberAlreadyInvited);
      if (isMemberAlreadyInvited) {
        throw new ConflictException('User is already invited.');
      }
      const response = await this.companyMembersService.create(payload);
      if (!response) {
        this.logger.error(
          'Member not invited',
          'inviteMember',
          'CompanyService',
        );
        throw new BadRequestException('Member not invited');
      }
      // const invitationLink = `http://localhost:3000/auth/phone?token=${payload.invitationToken}`;
      // await this.smsService.sendSMS({
      //   to: invitedUserPhone,
      //   message: `You have been invited to join a company. Click on the link to accept the invitation ${invitationLink}`,
      // });
      response.dataValues['user'] = user;
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async update(uuid: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const response = await this.companyRepository.update<CompanyDetails>(
        updateCompanyDto,
        {
          where: { uuid },
        },
      );

      if (!response) {
        this.logger.error('Company not updated', 'update', 'CompanyService');
        throw new BadRequestException('Company not updated');
      }
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async activateMember(token: string) {
    try {
      const member = await this.companyMembersService.findOne({ token: token });
      if (!member) {
        this.logger.error(
          'Invalid identity token',
          'activateMember',
          'CompanyService',
        );
        throw new NotFoundException('Invalid identity token');
      }
      const payload = {
        status: 'active',
      };
      const data = await this.companyMembersService.update(member.id, payload);
      if (!data) {
        this.logger.error(
          'Member not updated',
          'activateMember',
          'CompanyService',
        );
        throw new BadRequestException('Member not updated');
      }
    } catch (e) {
      console.log(e);
      this.logger.error(`Error activating member: ${e.message}`);
      throw e;
    }
  }

  async verifyRole(dto: any) {
    const { userId, companyId, role, data } = dto;
    console.log('userId...', userId);
    console.log('companyId...', companyId);
    console.log('role...', role);
    console.log('data...', data);

    // 1. Find the company member
    const companyMember = await this.companyMembersService.findOne({
      userId,
      companyId,
    });

    const professionalDetails = companyMember.professionalDetails || {};

    // Handle different role-specific identifiers
    if (!professionalDetails[data]) {
      professionalDetails[data.type] = data.value;
    }

    if (!companyMember) throw new Error('User is not part of this company');

    if (data.key) {
      const docEntry = await this.documentService.createDocument({
        companyMemberId: companyMember.id,
        userId: userId,
        source: 'kyc',
        name: data.name || data.type,
        size: data.size,
        key: data.key,
        url: data.url,
        extension: data.extension,
        value: data.value || null,
        type: data.type || 'text',
        verified: false,
        uploadedAt: new Date(),
        companyId: companyId,
        filetype: data.filetype,
      });
      console.log('docEntry...', docEntry);
    }

    // 3. Optional: Update verification status
    await this.companyMembersService.update(
      { id: companyMember.id },
      {
        professionalDetails: professionalDetails,
        status: 'active',
        role,
      },
    );
    return {
      message: 'Verification status updated',
      status: 'success',
    };
  }


}
