import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { VaultService } from './vault.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { FolderDto, UpdateFolderDto } from './dto/folder.dto';
import { DocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  generatePresignedUrl,
  getPresignedUrlUsingKey,
} from 'src/core/helpers/s3';
import { DocumentService } from './document/document.service';
import { FolderService } from './folder/folder.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vault')
@Controller('vault')
export class VaultController {
  constructor(
    private readonly vaultService: VaultService,
    private readonly documentService: DocumentService,
    private readonly folderService: FolderService,
  ) { }

  @Get('company/:companyUuid')
  async findUserFolders(@Param('companyUuid') companyUuid: string) {
    try {
      const response =
        await this.vaultService.findFoldersByCompanyUuid(companyUuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('get-presigned-url/:uuid')
  async getPresignedUrl(@Param('uuid') uuid: string) {
    try {
      const document = await this.documentService.findDocumentByUuid(uuid);
      if (!document) {
        throw new NotFoundException('Document not found');
      }
      const response = await getPresignedUrlUsingKey(document.key);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('generate-presigned-url')
  async generatePresignedUrl(@Body() body: any) {
    try {
      const { fileName, fileType, folder } = body;
      const response = await generatePresignedUrl({
        fileName,
        fileType,
        folder,
      });
      const { presignedUrl, key } = response;
      const result = await this.vaultService.createDocument({
        ...body,
        name: fileName,
        url: presignedUrl,
        key,
      });
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post()
  create(@Body() createVaultDto: CreateVaultDto) {
    return this.vaultService.create(createVaultDto);
  }

  @Post('create-folder')
  async createFolder(@Body() folder: FolderDto) {
    try {
      const response = await this.vaultService.createFolder(folder);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('folders/:companyUuid')
  async findFolderById(@Param('companyUuid') companyUuid: string) {
    try {
      const response = await this.vaultService.findAllFoldersByCompanyUuid(companyUuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('folder/:uuid')
  async findFolderByUUID(@Param('uuid') uuid: string) {
    try {
      const response = await this.vaultService.findFolderByUuid(uuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post('create-document')
  @UseInterceptors(FilesInterceptor('files'))
  async createDocument(
    @Body() document: DocumentDto,
    @UploadedFile() files: Array<Express.Multer.File>,
  ) {
    try {
      console.log(document);
      console.log(files);
      const response = await this.vaultService.createDocument(document);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('folder/:uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    try {
      const response = await this.folderService.updateFolderByUuid(
        uuid,
        updateFolderDto,
      );
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('update-document/:uuid')
  async updateDocument(
    @Param('uuid') uuid: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    try {
      const response = await this.documentService.updateDocumentByUuid(
        uuid,
        updateDocumentDto,
      );
      console.log('response...', response);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Delete('delete-folder/:uuid')
  async deleteFolder(@Param('uuid') uuid: string) {
    try {
      console.log('uuid...', uuid);
      const response = await this.folderService.deleteFolderByUuid(uuid);
      console.log('response...', response);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Delete('delete-document/:uuid')
  async removeDocument(@Param('uuid') uuid: string) {
    try {
      const response = await this.vaultService.removeDocumentByUuid(uuid);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
