import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ComplianceTask } from '../entities/task.entity';
import {
  COMPANY_TASK_REPOSITORY,
  DOCUMENT_REPOSITORY,
  TASK_REPOSITORY,
  COMPANY_MEMBER_REPOSITORY,
  COMPANY_TASK_DOCUMENT_REPOSITORY,
} from '@/core/constants';
import { CompanyDetails } from '@/company/entities/company.entity';
import { User } from '@/user/entity/user.entity';
import { CompanyChecklist } from '@/company/compliance/entities/companyChecklist.entity';
import { CompanyComplianceTask } from '../entities/companyTask.entity';
import { SupabaseStorageService } from '@/supabase/supabase-storage.service';
import { Document } from '@/vault/entities/document.entity';
import { CompanyMember } from '@/company/entities/company-members.entity';
import { CompanyTaskDocument } from '../entities/company-task-document.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: typeof ComplianceTask,
    @Inject(COMPANY_TASK_REPOSITORY)
    private readonly companyTaskRepository: typeof CompanyComplianceTask,
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: typeof Document,
    @Inject(COMPANY_MEMBER_REPOSITORY)
    private readonly companyMemberRepository: typeof CompanyMember,
    @Inject(COMPANY_TASK_DOCUMENT_REPOSITORY)
    private readonly companyTaskDocumentRepository: typeof CompanyTaskDocument,
    private readonly supabaseStorageService: SupabaseStorageService,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
  ): Promise<CompanyComplianceTask> {
    const {
      companyId,
      assignedById,
      assignedToIds,
      status,
      companyChecklistId,
      documentIds,
    } = createTaskDto;
    try {
      this.logger.debug('Creating new compliance task');

      const companyMember = await this.companyMemberRepository.findOne({
        where: { companyId, userId: assignedById },
      });

      if (!companyMember) {
        throw new BadRequestException('Company member not found');
      }

      const task =
        await this.companyTaskRepository.create<CompanyComplianceTask>({
          title: createTaskDto.title,
          companyId,
          assignedById,
          status,
          dueDate: new Date(),
          companyChecklistId: Number(companyChecklistId),
        });

      if (assignedToIds && assignedToIds.length > 0) {
        await task.setAssignedTo(assignedToIds);
      }

      // Attach documents if documentIds are provided
      // if (documentIds && documentIds.length > 0) {
      //   this.logger.debug(
      //     `Attaching ${documentIds.length} documents to task ID ${task.id}`,
      //   );

      //   for (const documentId of documentIds) {
      //     await this.companyTaskDocumentRepository.create({
      //       companyTaskId: task.id,
      //       documentId,
      //     });
      //   }

      //   this.logger.debug(
      //     `Successfully attached ${documentIds.length} documents to task ID ${task.id}`,
      //   );
      // }

      return task.reload({
        include: [
          // Document,
          { model: User, as: 'assignedTo' },
          { model: User, as: 'assignedBy' },
        ],
      });
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create task: ${error.message}`);
    }
  }

  async createBulkTasks(
    createTaskDtos: CreateTaskDto[],
  ): Promise<ComplianceTask[]> {
    try {
      this.logger.debug(
        `Creating ${createTaskDtos.length} new compliance tasks`,
      );
      const tasks =
        await this.taskRepository.bulkCreate<ComplianceTask>(createTaskDtos);

      this.logger.debug(`${tasks.length} tasks created successfully`);
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to create bulk tasks: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create bulk tasks: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<CompanyComplianceTask[]> {
    try {
      const tasks =
        await this.companyTaskRepository.findAll<CompanyComplianceTask>({
          include: [
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: User,
              as: 'assignedTo',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
          order: [['createdAt', 'DESC']],
        });

      this.logger.debug(`Retrieved ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to fetch tasks: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch tasks: ${error.message}`);
    }
  }

  async findByCompany(companyId: number): Promise<CompanyComplianceTask[]> {
    try {
      const tasks =
        await this.companyTaskRepository.findAll<CompanyComplianceTask>({
          where: { companyId },
          include: [
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: User,
              as: 'assignedTo',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
          order: [['createdAt', 'DESC']],
        });

      this.logger.debug(
        `Retrieved ${tasks.length} tasks for company ID ${companyId}`,
      );
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for company ID ${companyId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch tasks for company: ${error.message}`,
      );
    }
  }

  async findTasksByChecklist(
    checklistId: number,
  ): Promise<CompanyComplianceTask[]> {
    try {
      const tasks =
        await this.companyTaskRepository.findAll<CompanyComplianceTask>({
          where: { companyChecklistId: checklistId },
          include: [
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: User,
              as: 'assignedTo',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
        });

      this.logger.debug(
        `Retrieved ${tasks.length} tasks for checklist ID ${checklistId}`,
      );
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for checklist ID ${checklistId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch tasks for checklist: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<CompanyComplianceTask> {
    try {
      const task =
        await this.companyTaskRepository.findByPk<CompanyComplianceTask>(id, {
          include: [
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: User,
              as: 'assignedTo',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
        });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch task with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to fetch task: ${error.message}`);
    }
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<CompanyComplianceTask> {
    try {
      const task =
        await this.companyTaskRepository.findByPk<CompanyComplianceTask>(id);

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await task.update(updateTaskDto as any);
      this.logger.debug(`Task with ID ${id} updated successfully`);

      return task.reload({
        include: [
          Document,
          { model: User, as: 'assignedTo' },
          { model: User, as: 'assignedBy' },
        ],
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update task with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to update task: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const task =
        await this.companyTaskRepository.findByPk<CompanyComplianceTask>(id);

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await task.destroy();
      this.logger.debug(`Task with ID ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete task with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to delete task: ${error.message}`);
    }
  }

  async findTasksByAssignedUser(
    userId: number,
  ): Promise<CompanyComplianceTask[]> {
    try {
      const tasks =
        await this.companyTaskRepository.findAll<CompanyComplianceTask>({
          include: [
            {
              model: User,
              as: 'assignedTo',
              where: { id: userId },
              attributes: [],
            },
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
        });

      this.logger.debug(
        `Retrieved ${tasks.length} tasks assigned to user ID ${userId}`,
      );
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for user ID ${userId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch user tasks: ${error.message}`,
      );
    }
  }

  async findByCompanyUuid(companyUuid: string): Promise<CompanyComplianceTask[]> {
    try {
      const tasks =
        await this.companyTaskRepository.findAll<CompanyComplianceTask>({
          include: [
            {
              model: CompanyDetails,
              where: { uuid: companyUuid },
              attributes: ['name', 'uuid'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: User,
              as: 'assignedTo',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
          order: [['createdAt', 'DESC']],
        });

      this.logger.debug(
        `Retrieved ${tasks.length} tasks for company UUID ${companyUuid}`,
      );
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for company UUID ${companyUuid}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch tasks for company: ${error.message}`,
      );
    }
  }

  async findTasksByChecklistUuid(
    checklistUuid: string,
  ): Promise<CompanyComplianceTask[]> {
    try {
      const tasks =
        await this.companyTaskRepository.findAll<CompanyComplianceTask>({
          include: [
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: User,
              as: 'assignedTo',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              where: { uuid: checklistUuid },
              attributes: ['title', 'description', 'uuid'],
            },
            {
              model: Document,
            },
          ],
        });

      this.logger.debug(
        `Retrieved ${tasks.length} tasks for checklist UUID ${checklistUuid}`,
      );
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for checklist UUID ${checklistUuid}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch tasks for checklist: ${error.message}`,
      );
    }
  }

  async findOneByUuid(uuid: string): Promise<CompanyComplianceTask> {
    try {
      const task =
        await this.companyTaskRepository.findOne<CompanyComplianceTask>({
          where: { uuid },
          include: [
            {
              model: CompanyDetails,
              attributes: ['name', 'uuid'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: User,
              as: 'assignedTo',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
        });

      if (!task) {
        throw new NotFoundException(`Task with UUID ${uuid} not found`);
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch task with UUID ${uuid}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to fetch task: ${error.message}`);
    }
  }

  async updateByUuid(
    uuid: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<CompanyComplianceTask> {
    try {
      const task = await this.findOneByUuid(uuid);
      await task.update(updateTaskDto as any);
      this.logger.debug(`Task with UUID ${uuid} updated successfully`);

      return task.reload({
        include: [
          Document,
          { model: User, as: 'assignedTo' },
          { model: User, as: 'assignedBy' },
        ],
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update task with UUID ${uuid}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to update task: ${error.message}`);
    }
  }

  async removeByUuid(uuid: string): Promise<void> {
    try {
      const task = await this.findOneByUuid(uuid);
      await task.destroy();
      this.logger.debug(`Task with UUID ${uuid} deleted successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete task with UUID ${uuid}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to delete task: ${error.message}`);
    }
  }

  async findTasksByAssignedUserToken(
    userToken: string,
  ): Promise<CompanyComplianceTask[]> {
    try {
      const tasks =
        await this.companyTaskRepository.findAll<CompanyComplianceTask>({
          include: [
            {
              model: User,
              as: 'assignedTo',
              where: { userToken },
              attributes: ['name', 'email', 'userToken'],
            },
            {
              model: CompanyDetails,
              attributes: ['name'],
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['name', 'email'],
            },
            {
              model: CompanyChecklist,
              attributes: ['title', 'description'],
            },
            {
              model: Document,
            },
          ],
        });

      this.logger.debug(
        `Retrieved ${tasks.length} tasks assigned to user token ${userToken}`,
      );
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for user token ${userToken}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch user tasks: ${error.message}`,
      );
    }
  }
}
