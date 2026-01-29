import { DOCUMENT_REPOSITORY } from '@/core/constants';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Document } from '../entities/document.entity';
import { Folder } from '../entities/folder.entity';
import { CompanyDetails } from '@/company/entities/company.entity';
import { User } from '@/user/entity/user.entity';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: typeof Document,
  ) {}

  async createDocument(document: Document.Document): Promise<Document> {
    try {
      const response = await this.documentRepository.create<Document>(document);
      if (!response) {
        this.logger.error('Document could not be created');
        throw new BadRequestException('Document could not be created');
      }
      return response;
    } catch (err) {
      this.logger.error(
        'Error creating document',
        err instanceof Error ? err.stack : String(err),
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Document could not be created',
      );
    }
  }

  async findDocumentById(id: number) {
    try {
      const response = await this.documentRepository.findByPk(id);
      if (!response) {
        this.logger.debug(`Document with id ${id} not found`);
      }
      return response;
    } catch (err) {
      this.logger.error(
        `Error finding document with id ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Error finding document',
      );
    }
  }

  async deleteDocument(id: number) {
    try {
      const response = await this.documentRepository.destroy({ where: { id } });
      if (!response) {
        this.logger.warn(`Document with id ${id} not found for deletion`);
        throw new BadRequestException('Document could not be deleted');
      }
      return response;
    } catch (err) {
      this.logger.error(
        `Error deleting document with id ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Document could not be deleted',
      );
    }
  }

  async updateDocument(id: number, updateDocumentDto: any): Promise<Document> {
    try {
      const document = await this.documentRepository.findByPk(id);
      if (!document) {
        this.logger.warn(`Document with id ${id} not found for update`);
        throw new BadRequestException('Document not found');
      }
      return await document.update(updateDocumentDto);
    } catch (err) {
      this.logger.error(
        `Error updating document with id ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Document could not be updated',
      );
    }
  }

  async findDocumentByUuid(uuid: string): Promise<Document> {
    try {
      const document = await this.documentRepository.findOne({
        where: { uuid },
        include: [Folder, CompanyDetails, User],
      });
      if (!document) {
        this.logger.debug(`Document with uuid ${uuid} not found`);
        throw new NotFoundException('Document not found');
      }
      return document;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(
        `Error finding document with uuid ${uuid}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Error finding document',
      );
    }
  }

  async deleteDocumentByUuid(uuid: string): Promise<number> {
    try {
      const document = await this.findDocumentByUuid(uuid);
      const response = await this.documentRepository.destroy({ where: { id: document.id } });
      if (!response) {
        this.logger.warn(`Document with uuid ${uuid} not found for deletion`);
        throw new BadRequestException('Document could not be deleted');
      }
      return response;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(
        `Error deleting document with uuid ${uuid}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Document could not be deleted',
      );
    }
  }

  async updateDocumentByUuid(uuid: string, updateDocumentDto: any): Promise<Document> {
    try {
      const document = await this.findDocumentByUuid(uuid);
      return await document.update(updateDocumentDto);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(
        `Error updating document with uuid ${uuid}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Document could not be updated',
      );
    }
  }
}
