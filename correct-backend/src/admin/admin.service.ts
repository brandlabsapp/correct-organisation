import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  COMPANY_REPOSITORY,
  CHECKLIST_REPOSITORY,
  USER_REPOSITORY,
  ADMIN_REPOSITORY,
  ADMIN_ROLE_REPOSITORY,
  ROLE_REPOSITORY,
  bcryptConstants,
  TASK_REPOSITORY,
  COMPANY_TASK_REPOSITORY,
} from '@/core/constants';
import { CompanyDetails } from '@/company/entities/company.entity';
import { Folder } from '@/vault/entities/folder.entity';
import { Document } from '@/vault/entities/document.entity';
import { CompanyMember } from '@/company/entities/company-members.entity';
import { AdminRole } from './entities/admin-roles.entity';
import { CompanyChecklist } from '@/company/compliance/entities/companyChecklist.entity';
import { Admin } from './entities/admin.entity';
import { User } from '@/user/entity/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Compliance } from '@/company/compliance/entities/compliance.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateChecklistDto } from './dto/checklist.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ComplianceTask } from '@/company/compliance/entities/task.entity';
import { CompanyComplianceTask } from '@/company/compliance/entities/companyTask.entity';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: typeof CompanyDetails,
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklistRepository: typeof CompanyChecklist,
    @Inject(COMPANY_TASK_REPOSITORY)
    private readonly companyTaskRepository: typeof CompanyComplianceTask,
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: typeof ComplianceTask,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof User,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: typeof Role,
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: typeof Admin,
    @Inject(ADMIN_ROLE_REPOSITORY)
    private readonly adminRoleRepository: typeof AdminRole,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAdminById(id: number) {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(admin: {
    phone: string;
    password: string;
    roles: string[];
  }) {
    const hashedPassword = await bcrypt.hash(
      admin.password,
      bcryptConstants.saltOrRounds,
    );
    const newAdmin = await this.adminRepository.create({
      phone: admin.phone,
      password: hashedPassword,
    });
    if (!newAdmin) {
      throw new BadRequestException('Admin not created');
    }
    admin.roles.forEach(async (role: string) => {
      const dbRole = await this.roleRepository.findOne({
        where: { name: role },
      });
      if (!dbRole) {
        throw new NotFoundException('Role not found');
      }
      const adminRole = await this.adminRoleRepository.create({
        adminId: newAdmin.id,
        roleId: dbRole.id,
      });
      if (!adminRole) {
        throw new BadRequestException('Admin role not created');
      }
    });

    return newAdmin;
  }

  async login(data: { phone: string; password: string }) {
    try {
      console.log(data, 'data');
      console.log(data.phone, 'data.phone');
      console.log(data.password, 'data.password');
      const admin = await this.adminRepository.findOne({
        where: { phone: data.phone },
      });
      console.log(admin, 'admin');
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        admin.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      const payload = { id: admin.id, phone: admin.phone };
      const token = await this.jwtService.signAsync(payload);
      admin.dataValues['token'] = token;
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async findCompanyById(id: number) {
    const cacheKey = `company_${id}`;
    const cachedCompany = await this.cacheManager.get<CompanyDetails>(cacheKey);
    if (cachedCompany) {
      this.logger.log('Company details found in cache:', cachedCompany);
      return cachedCompany;
    } else {
      const company = await this.companyRepository.findOne({
        where: { id },
        include: [
          {
            model: Folder,
            include: [
              {
                model: Document,
                as: 'documents',
              },
            ],
          },
          {
            model: Document,
          },
          {
            model: CompanyMember,
            include: [
              {
                model: User,
                as: 'user',
              },
            ],
          },
          {
            model: CompanyChecklist,
            include: [
              {
                model: Compliance,
                as: 'compliance',
              },
            ],
          },
        ],
      });
      await this.cacheManager.set(cacheKey, company);
      return company;
    }
  }

  async updateCompanyMember(id: number, updateAdminDto: UpdateAdminDto) {
    const updatedUser = await this.userRepository.update(updateAdminDto, {
      where: { id: updateAdminDto.userId },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async createBulkChecklist(checklist: CreateChecklistDto): Promise<number> {
    if (
      !Array.isArray(checklist.complianceIds) ||
      checklist.complianceIds.length === 0
    ) {
      throw new BadRequestException('Valid compliance IDs array is required');
    }

    const createPromises = checklist.complianceIds.map(
      async (complianceId: number) => {
        const newChecklist = await this.checklistRepository.create({
          companyId: Number(checklist.companyId),
          complianceId,
          status: 'pending',
        });

        if (!newChecklist) {
          this.logger.warn(
            `Checklist creation failed for compliance ID ${complianceId}. Skipping task creation.`,
          );
          return null;
        }

        const taskTemplates = await this.taskRepository.findAll({
          where: {
            complianceId: complianceId,
          },
        });

        const companyTasks = taskTemplates.map((task) => {
          return {
            companyId: Number(checklist.companyId),
            companyChecklistId: newChecklist.id,
            taskId: task.id,
            status: 'pending',
          };
        });

        await this.companyTaskRepository.bulkCreate(companyTasks);
        return newChecklist;
      },
    );

    const results = await Promise.all(createPromises);
    const createdCount = results.filter((result) => result !== null).length;

    if (createdCount === 0) {
      throw new BadRequestException(
        'No checklists were created successfully (and consequently no tasks).',
      );
    }

    return createdCount;
  }

  async deleteChecklistById(id: number) {
    try {
      const deletedChecklist = await this.checklistRepository.destroy({
        where: { id },
      });
      return deletedChecklist;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    console.log('update admin dto', updateAdminDto);
    return `This action updates a #${id} admin`;
  }
}
