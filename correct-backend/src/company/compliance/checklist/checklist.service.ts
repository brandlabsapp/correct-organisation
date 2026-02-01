import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CompanyChecklist } from '../entities/companyChecklist.entity';
import {
  COMPLIANCE_REPOSITORY,
  CHECKLIST_REPOSITORY,
  TASK_REPOSITORY,
  COMPANY_TASK_REPOSITORY,
  COMPANY_REPOSITORY,
} from '@/core/constants';
import { Compliance } from '../entities/compliance.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { ComplianceTask } from '../entities/task.entity';
import { CompanyComplianceTask } from '../entities/companyTask.entity';
import { User } from '@/user/entity/user.entity';

@Injectable()
export class ChecklistService {
  private readonly logger = new Logger(ChecklistService.name);

  constructor(
    @Inject(COMPLIANCE_REPOSITORY)
    private readonly complianceRepository: typeof Compliance,
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklistRepository: typeof CompanyChecklist,
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: typeof ComplianceTask,
    @Inject(COMPANY_TASK_REPOSITORY)
    private readonly companyTaskRepository: typeof CompanyComplianceTask,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: typeof CompanyDetails,
  ) {}

  async createChecklist(
    checklist: CreateChecklistDto,
  ): Promise<CompanyChecklist> {
    if (!checklist) {
      throw new BadRequestException('Checklist data is required');
    }

    try {
      this.logger.debug('Creating new compliance checklist');

      const fetchCompany = await this.companyRepository.findByPk(
        checklist.companyId,
      );

      if (!fetchCompany) {
        throw new NotFoundException('Company not found');
      }

      const newChecklist =
        await this.checklistRepository.create<CompanyChecklist>({
          companyId: fetchCompany.id,
          userId: checklist.userId,
          complianceId: checklist.complianceIds[0],
          status: 'pending',
        });

      const compliance = await Compliance.findByPk(checklist.complianceIds[0]);

      if (compliance) {
        await this.createTasksFromCompliance(
          compliance.id,
          newChecklist.id,
          newChecklist.companyId,
        );
      }

      this.logger.debug(
        `Checklist created successfully with ID: ${newChecklist.id}`,
      );
      return newChecklist;
    } catch (error) {
      this.logger.error(
        `Failed to create checklist: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create checklist: ${error.message}`,
      );
    }
  }

  private async createTasksFromCompliance(
    complianceId: number,
    checklistId: number,
    companyId: number,
  ): Promise<void> {
    try {
      const taskTemplates = await this.taskRepository.findAll({
        where: {
          complianceId,
        },
      });

      if (taskTemplates.length === 0) {
        this.logger.debug(
          `No task templates found for compliance ID ${complianceId}`,
        );
        return;
      }

      const taskInstances = taskTemplates.map((template) => {
        return {
          taskId: template.id,
          companyId,
          companyChecklistId: checklistId,
          title: template.title,
          status: 'pending',
        };
      });

      await this.companyTaskRepository.bulkCreate(taskInstances);
      this.logger.debug(
        `Created ${taskInstances.length} tasks for checklist ID ${checklistId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create tasks from compliance: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAllChecklist(): Promise<CompanyChecklist[]> {
    try {
      const checklists =
        await this.checklistRepository.findAll<CompanyChecklist>({
          include: [
            {
              model: Compliance,
              attributes: ['formName', 'state', 'category'],
            },
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
          ],
          order: [['createdAt', 'DESC']],
        });
      this.logger.debug(`Retrieved ${checklists?.length || 0} checklists`);
      return checklists || [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch all checklists: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve all checklists: ${error.message}`,
      );
    }
  }

  async getCompanyChecklist(
    companyId: number,
    checklistId?: number,
  ): Promise<CompanyChecklist | CompanyChecklist[]> {
    if (!companyId) {
      throw new BadRequestException('Company ID is required');
    }

    try {
      const includeRelations = [
        {
          model: CompanyComplianceTask,
          include: [
            {
              model: ComplianceTask,
            },
            {
              model: User,
              as: 'assignedTo',
            },
          ],
        },
        {
          model: Compliance,
        },
      ];

      if (checklistId) {
        const checklist =
          await this.checklistRepository.findOne<CompanyChecklist>({
            where: { complianceId: checklistId },
            include: includeRelations,
          });
        this.logger.debug(
          `Retrieved ${
            checklist ? 1 : 0
          } checklist for company ID ${companyId} and compliance ID ${checklistId}`,
        );
        return checklist;
      } else {
        const checklists =
          await this.checklistRepository.findAll<CompanyChecklist>({
            where: { companyId },
            include: includeRelations,
            order: [['createdAt', 'DESC']],
          });
        this.logger.debug(
          `Retrieved ${
            checklists?.length || 0
          } checklists for company ID ${companyId}`,
        );
        return checklists || [];
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch checklists for company ID ${companyId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve compliance checklist: ${error.message}`,
      );
    }
  }

  async updateChecklistStatus(
    checklistId: number,
    status: string,
  ): Promise<CompanyChecklist> {
    try {
      const checklist = await this.checklistRepository.findByPk(checklistId);

      if (!checklist) {
        throw new BadRequestException(
          `Checklist with ID ${checklistId} not found`,
        );
      }

      await checklist.update({ status });
      this.logger.debug(
        `Updated status of checklist ID ${checklistId} to ${status}`,
      );

      return checklist;
    } catch (error) {
      this.logger.error(
        `Failed to update checklist status: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update checklist status: ${error.message}`,
      );
    }
  }

  async getChecklistById(id: number): Promise<Compliance> {
    try {
      const checklist = await this.complianceRepository.findByPk(id, {
        include: [
          {
            model: ComplianceTask,
          },
        ],
      });
      return checklist;
    } catch (error) {
      this.logger.error(
        `Failed to get checklist by ID: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get checklist by ID: ${error.message}`,
      );
    }
  }
}
