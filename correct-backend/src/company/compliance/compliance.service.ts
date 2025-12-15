import * as fs from 'fs/promises';
import * as path from 'path';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { UpdateComplianceDto } from './dto/update-compliance.dto';
import { Compliance } from './entities/compliance.entity';
import {
  COMPLIANCE_REPOSITORY,
  DOCUMENT_REPOSITORY,
  TASK_REPOSITORY,
  COMPLIANCE_DOCUMENT_REPOSITORY,
} from '@/core/constants';
import { ImportComplianceDto } from './dto/import-compliance.dto';
import { ComplianceTask } from './entities/task.entity';
import { Document } from '@/vault/entities/document.entity';
import { SupabaseStorageService } from '@/supabase/supabase-storage.service';
import { ComplianceDocument } from './entities/compliance-document.entity';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(
    @Inject(COMPLIANCE_REPOSITORY)
    private readonly complianceRepository: typeof Compliance,
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: typeof ComplianceTask,
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: typeof Document,
    @Inject(COMPLIANCE_DOCUMENT_REPOSITORY)
    private readonly complianceDocumentRepository: typeof ComplianceDocument,
    private readonly supabaseStorageService: SupabaseStorageService,
  ) {}

  async create(createComplianceDto: CreateComplianceDto) {
    try {
      this.logger.debug('Creating new compliance');

      const response =
        await this.complianceRepository.create(createComplianceDto);

      this.logger.debug(
        `Compliance created successfully with ID: ${response.id}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to create compliance: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create compliance: ${error.message}`,
      );
    }
  }

  async importBulk(complianceData: ImportComplianceDto[]) {
    try {
      this.logger.debug(
        `Importing ${complianceData.length} compliance records`,
      );
      const results = [];
      for (const data of complianceData) {
        const { tasks, docs, ...complianceFields } = data;
        const compliance =
          await this.createComplianceWithTransaction(complianceFields);
        results.push(compliance);

        if (tasks && tasks.length > 0) {
          console.log(tasks);
          await this.createTaskTemplatesForCompliance(compliance.id, tasks);
        }

        if (docs && docs.length > 0) {
          await this.handleDocs(compliance, docs);
        }
      }

      this.logger.debug(
        `Successfully imported ${results.length} compliance records`,
      );
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to import compliance data: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to import compliance data: ${error.message}`,
      );
    }
  }

  private async createComplianceWithTransaction(
    data: Omit<ImportComplianceDto, 'tasks' | 'docs'>,
  ) {
    try {
      console.log(data);
      return await this.complianceRepository.create(data);
    } catch (error) {
      console.log(error);
      this.logger.error(
        `Failed to create compliance in transaction: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async handleDocs(
    compliance: Compliance,
    docs: ImportComplianceDto['docs'],
  ) {
    if (!docs || docs.length === 0) return;

    try {
      for (const docDto of docs) {
        const localDocPath = path.join(
          process.cwd(),
          'assets/default-docs',
          docDto.name,
        );
        const buffer = await fs.readFile(localDocPath);

        const supabasePath = `compliance/${compliance.title}/${docDto.name}`;

        const { url, key } = await this.supabaseStorageService.upload(
          supabasePath,
          buffer,
          docDto.contentType,
        );

        const [doc] = await this.documentRepository.findOrCreate({
          where: { name: docDto.name },
          defaults: {
            name: docDto.name,
            url,
            key,
          },
        });

        await compliance.$add('docs', doc);
      }
      this.logger.debug(
        `Associated and uploaded ${docs.length} docs with compliance ID ${compliance.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to handle docs for compliance ID ${compliance.id}: ${error.message}`,
        error.stack,
      );
      if (error.code === 'ENOENT') {
        throw new BadRequestException(
          `Default document not found: ${error.path}`,
        );
      }
      throw error;
    }
  }

  private async createTaskTemplatesForCompliance(
    complianceId: number,
    tasks: ImportComplianceDto['tasks'],
  ) {
    if (!tasks || tasks.length === 0) return;

    try {
      const taskTemplates = tasks.map((task) => ({
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        complianceId: complianceId,
      }));

      await this.taskRepository.bulkCreate(taskTemplates);
      this.logger.debug(
        `Created ${taskTemplates.length} task templates for compliance ID ${complianceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create task templates: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<Compliance[]> {
    return await this.complianceRepository.findAll<Compliance>({
      include: [
        { model: ComplianceTask },
        {
          model: Document,
        },
      ],
    });
  }

  async findOne(id: number): Promise<Compliance> {
    try {
      const compliance = await this.complianceRepository.findByPk(id, {
        include: [
          {
            model: ComplianceTask,
          },
          {
            model: Document,
          },
        ],
      });
      if (!compliance) {
        throw new BadRequestException(`Compliance with ID ${id} not found`);
      }
      return compliance;
    } catch (error) {
      this.logger.error(
        `Failed to fetch compliance with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch compliance: ${error.message}`,
      );
    }
  }

  async update(id: number, updateComplianceDto: UpdateComplianceDto) {
    try {
      const compliance = await this.complianceRepository.findByPk(id);
      if (!compliance) {
        throw new BadRequestException(`Compliance with ID ${id} not found`);
      }

      await compliance.update(updateComplianceDto);
      this.logger.debug(`Updated compliance with ID ${id}`);

      return compliance;
    } catch (error) {
      this.logger.error(
        `Failed to update compliance with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update compliance: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const compliance = await this.complianceRepository.findByPk(id);
      if (!compliance) {
        throw new BadRequestException(`Compliance with ID ${id} not found`);
      }

      await compliance.destroy();
      this.logger.debug(`Deleted compliance with ID ${id}`);

      return { success: true, message: 'Compliance deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to delete compliance with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to delete compliance: ${error.message}`,
      );
    }
  }

  async getComplianceDocuments(complianceId: number): Promise<Document[]> {
    try {
      const compliance = await this.complianceRepository.findByPk(
        complianceId,
        {
          include: [
            {
              model: Document,
            },
          ],
        },
      );

      if (!compliance) {
        throw new BadRequestException(
          `Compliance with ID ${complianceId} not found`,
        );
      }

      return compliance.docs;
    } catch (error) {
      this.logger.error(
        `Failed to get documents for compliance ${complianceId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get compliance documents: ${error.message}`,
      );
    }
  }

  async detachDocument(
    complianceId: number,
    documentId: number,
  ): Promise<void> {
    try {
      const complianceDocument =
        await this.complianceDocumentRepository.findOne({
          where: {
            complianceId,
            documentId,
          },
        });

      if (!complianceDocument) {
        throw new BadRequestException(
          `Document ${documentId} is not attached to compliance ${complianceId}`,
        );
      }

      await complianceDocument.destroy();
      this.logger.debug(
        `Document ${documentId} detached from compliance ${complianceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to detach document ${documentId} from compliance ${complianceId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to detach document: ${error.message}`,
      );
    }
  }
}
