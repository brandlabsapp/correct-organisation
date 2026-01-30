import { FolderService } from './folder/folder.service';
import { Injectable } from '@nestjs/common';
import { CreateVaultDto } from './dto/create-vault.dto';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { DocumentService } from './document/document.service';
import { FolderDto } from './dto/folder.dto';
import { DocumentDto } from './dto/document.dto';

@Injectable()
export class VaultService {
  constructor(
    private readonly folderService: FolderService,
    private readonly documentService: DocumentService,
  ) {}
  create(createVaultDto: CreateVaultDto) {
    return 'This action adds a new vault';
  }

  async createFolder(folder: FolderDto) {
    try {
      const response = await this.folderService.createFolder(folder);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async createDocument(document: DocumentDto) {
    try {
      const response = await this.documentService.createDocument(document);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findFolderById(id: number) {
    try {
      const response = await this.folderService.getFolder({ id: id });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findFolderByUuid(uuid: string) {
    try {
      const response = await this.folderService.getFolder({ uuid: uuid });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findFoldersByCompanyId(companyId: number) {
    try {
      const response =
        await this.folderService.findFoldersAndDocuments(companyId);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findAllFolders(companyId: number) {
    try {
      const response = await this.folderService.findAll({
        companyId: companyId,
      });
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} vault`;
  }

  update(id: number, updateVaultDto: UpdateVaultDto) {
    return `This action updates a #${id} vault`;
  }

  async removeDocument(id: number) {
    try {
      const response = await this.documentService.deleteDocument(id);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async removeDocumentByUuid(uuid: string) {
    try {
      const response = await this.documentService.deleteDocumentByUuid(uuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findFoldersByCompanyUuid(companyUuid: string) {
    try {
      const response =
        await this.folderService.findFoldersAndDocumentsByCompanyUuid(companyUuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findAllFoldersByCompanyUuid(companyUuid: string) {
    try {
      const response = await this.folderService.findAllByCompanyUuid(companyUuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findDocumentByUuid(uuid: string) {
    try {
      const response = await this.documentService.findDocumentByUuid(uuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
