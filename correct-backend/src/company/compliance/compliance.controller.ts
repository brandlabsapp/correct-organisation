import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { UpdateComplianceDto } from './dto/update-compliance.dto';
import { ImportComplianceDto } from './dto/import-compliance.dto';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SupabaseStorageService } from '@/supabase/supabase-storage.service';
import { DocumentService } from '@/vault/document/document.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(
    private readonly complianceService: ComplianceService,
    private readonly supabaseStorageService: SupabaseStorageService,
    private readonly documentService: DocumentService,
  ) { }

  @Post()
  async create(@Body() createComplianceDto: CreateComplianceDto) {
    try {
      const response = await this.complianceService.create(createComplianceDto);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('import-bulk')
  async importBulk(@Body() complianceData: ImportComplianceDto[]) {
    try {
      const response = await this.complianceService.importBulk(complianceData);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('list')
  async findAll() {
    try {
      const response = await this.complianceService.findAll();
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    try {
      return await this.complianceService.findOneByUuid(uuid);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateComplianceDto: UpdateComplianceDto,
  ) {
    try {
      return await this.complianceService.updateByUuid(uuid, updateComplianceDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    try {
      return await this.complianceService.removeByUuid(uuid);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get(':uuid/documents')
  async getComplianceDocuments(@Param('uuid') uuid: string) {
    try {
      return await this.complianceService.getComplianceDocumentsByUuid(uuid);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':uuid/documents/:documentUuid')
  async detachDocument(
    @Param('uuid') uuid: string,
    @Param('documentUuid') documentUuid: string,
  ) {
    try {
      await this.complianceService.detachDocumentByUuid(uuid, documentUuid);
      return { success: true, message: 'Document detached successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('create-with-documents')
  @UseInterceptors(FilesInterceptor('files'))
  async createWithDocuments(
    @Body() createComplianceDto: CreateComplianceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const compliance =
        await this.complianceService.create(createComplianceDto);

      if (files && files.length > 0) {
        const documents = [];

        for (const file of files) {
          const supabasePath = `compliance/${compliance.id}/${file.originalname}`;

          const { url, key } = await this.supabaseStorageService.upload(
            supabasePath,
            file.buffer,
            file.mimetype,
          );

          const document = await this.documentService.createDocument({
            name: file.originalname,
            url,
            key,
            type: 'compliance_document',
            filetype: file.mimetype,
            size: file.size,
            source: 'compliance',
            extension: file.mimetype.split('/')[1],
            category: 'compliance',
            tags: [],
            description: '',
            folderId: null,
            companyMemberId: null,
            value: null,
            verified: false,
            uploadedAt: new Date(),
          });

          documents.push(document);
        }

        if (documents.length > 0) {
          await compliance.addDocs(documents);
        }
      }

      return this.complianceService.findOne(compliance.id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
