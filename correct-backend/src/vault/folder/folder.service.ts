import { DOCUMENT_REPOSITORY, FOLDER_REPOSITORY } from '@/core/constants';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Folder } from '../entities/folder.entity';
import { FolderDto } from '../dto/folder.dto';
import { Document } from '../entities/document.entity';

@Injectable()
export class FolderService {
  private readonly logger = new Logger(FolderService.name);
  constructor(
    @Inject(FOLDER_REPOSITORY) private readonly folderRepository: typeof Folder,
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: typeof Document,
  ) {}

  async createFolder(folder: FolderDto): Promise<Folder> {
    try {
      const response = await this.folderRepository.create<Folder>(folder);
      if (!response) {
        throw new BadRequestException('Error creating folder');
      }
      return response;
    } catch (err) {
      this.logger.error(err, 'createFolder', 'FolderService');
      throw err;
    }
  }

  async getFolder(condition: any): Promise<Folder> {
    try {
      return this.folderRepository.findOne<Folder>({
        where: {
          ...condition,
        },
        include: [
          {
            model: Document,
            required: false,
          },
          {
            model: Folder,
            as: 'parentFolder',
            required: false,
            include: [
              {
                model: Document,
                required: false,
              },
            ],
          },
          {
            model: Folder,
            as: 'childFolders',
            required: false,
            include: [
              {
                model: Document,
                required: false,
              },
            ],
          },
        ],
      });
    } catch (err) {
      this.logger.error(err, 'getFolder', 'FolderService');
      throw err;
    }
  }

  async findFoldersAndDocuments(companyId: number): Promise<any> {
    try {
      const folders = await this.folderRepository.findAll<Folder>({
        where: { companyId, parentId: null },
        include: [Document, { model: Folder, as: 'childFolders' }],
        order: [['createdAt', 'DESC']],
      });
      const documents = await this.documentRepository.findAll<Document>({
        where: { companyId, folderId: null },
        order: [['createdAt', 'DESC']],
      });

      const response = {
        folders,
        documents,
      };

      if (!response) {
        this.logger.error(
          'Error fetching folders and documents',
          'FolderService',
          'findFoldersAndDocuments',
        );
        throw new BadRequestException('Error fetching folders and documents');
      }
      return response;
    } catch (err) {
      this.logger.error(err, 'findFoldersAndDocuments', 'FolderService');
      console.error(err);
      throw err;
    }
  }

  async findAll(condition: any): Promise<Folder[]> {
    try {
      const response = await this.folderRepository.findAll<Folder>({
        where: {
          ...condition,
        },
        include: [
          {
            model: Folder,
            as: 'childFolders',
            required: false,
            include: [
              {
                model: Document,
                required: false,
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      if (!response) {
        this.logger.error('Error fetching folders', 'FolderService', 'findAll');
        throw new BadRequestException('Error fetching folders');
      }
      return response;
    } catch (err) {
      this.logger.error(err, 'findAll', 'FolderService');
      console.error(err);
      throw err;
    }
  }

  async updateFolder(id: number, updateFolderDto: any): Promise<Folder> {
    try {
      console.log('updateFolderDto', updateFolderDto);
      const folder = await this.folderRepository.findByPk(id);
      if (!folder) {
        throw new BadRequestException('Folder not found');
      }
      return folder.update(updateFolderDto);
    } catch (err) {
      this.logger.error(err, 'updateFolder', 'FolderService');
      console.error(err);
      throw err;
    }
  }

  async deleteFolder(id: number): Promise<Record<string, string>> {
    try {
      console.log('id...', id);
      const folder = await this.folderRepository.findByPk(id);
      if (!folder) {
        throw new BadRequestException('Folder not found');
      }
      await folder.destroy();
      return { message: 'Folder deleted successfully' };
    } catch (err) {
      this.logger.error(err, 'deleteFolder', 'FolderService');
      throw err;
    }
  }

  async updateFolderByUuid(uuid: string, updateFolderDto: any): Promise<Folder> {
    try {
      const folder = await this.getFolder({ uuid });
      if (!folder) {
        throw new BadRequestException('Folder not found');
      }
      return folder.update(updateFolderDto);
    } catch (err) {
      this.logger.error(err, 'updateFolderByUuid', 'FolderService');
      throw err;
    }
  }

  async deleteFolderByUuid(uuid: string): Promise<Record<string, string>> {
    try {
      const folder = await this.getFolder({ uuid });
      if (!folder) {
        throw new BadRequestException('Folder not found');
      }
      await folder.destroy();
      return { message: 'Folder deleted successfully' };
    } catch (err) {
      this.logger.error(err, 'deleteFolderByUuid', 'FolderService');
      throw err;
    }
  }

  async findFoldersAndDocumentsByCompanyUuid(companyUuid: string): Promise<any> {
    try {
      const company = await this.folderRepository.sequelize.models.CompanyDetails.findOne({
        where: { uuid: companyUuid },
      });
      if (!company) {
        throw new BadRequestException('Company not found');
      }
      return this.findFoldersAndDocuments(company.get('id') as number);
    } catch (err) {
      this.logger.error(err, 'findFoldersAndDocumentsByCompanyUuid', 'FolderService');
      throw err;
    }
  }

  async findAllByCompanyUuid(companyUuid: string): Promise<Folder[]> {
    try {
      const company = await this.folderRepository.sequelize.models.CompanyDetails.findOne({
        where: { uuid: companyUuid },
      });
      if (!company) {
        throw new BadRequestException('Company not found');
      }
      return this.findAll({ companyId: company.get('id') as number });
    } catch (err) {
      this.logger.error(err, 'findAllByCompanyUuid', 'FolderService');
      throw err;
    }
  }
}
