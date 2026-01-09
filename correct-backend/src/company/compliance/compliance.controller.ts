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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.complianceService.findOne(+id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateComplianceDto: UpdateComplianceDto,
  ) {
    try {
      return await this.complianceService.update(+id, updateComplianceDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.complianceService.remove(+id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get(':id/documents')
  async getComplianceDocuments(@Param('id') id: string) {
    try {
      return await this.complianceService.getComplianceDocuments(+id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':id/documents/:documentId')
  async detachDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
  ) {
    try {
      await this.complianceService.detachDocument(+id, +documentId);
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
