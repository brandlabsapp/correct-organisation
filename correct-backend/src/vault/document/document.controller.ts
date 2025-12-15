import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { SupabaseStorageService } from '@/supabase/supabase-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ExtractionService } from '@/extraction/extraction.service';
import { QdrantService } from '@/qdrant/qdrant.service';
import { CORRECT_COLLECTION } from '@/core/constants';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly supabaseStorageService: SupabaseStorageService,
    private readonly extractionService: ExtractionService,
    private readonly qdrantService: QdrantService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadDocument(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Body received:', body);
    console.log('File received:', file ? 'YES' : 'NO');

    if (!file) {
      throw new BadRequestException('No file provided. Please upload a file.');
    }

    console.log('File details:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer ? `${file.buffer.length} bytes` : 'no buffer',
    });

    const { url, key } = await this.supabaseStorageService.upload(
      file.originalname,
      file.buffer,
      file.mimetype,
    );

    console.log('URL:', url);
    console.log('Key:', key);

    const response = await this.documentService.createDocument({
      name: file.originalname,
      userId: body.userId,
      companyId: body.companyId,
      source: body.source,
      url: url,
      key: key,
      filetype: file.mimetype,
      size: file.size,
      extension: file.mimetype.split('/')[1],
    });

    const extractedText = await this.extractionService.extractText(file);

    if (!extractedText) {
      throw new BadRequestException('Failed to extract text from file');
    }

    const qdrantResponse = await this.qdrantService.addDocument(
      CORRECT_COLLECTION,
      extractedText,
      {
        documentId: response.id,
        userId: body.userId,
        companyId: body.companyId,
        source: body.source,
        url: url,
        key: key,
      },
    );

    console.log('Qdrant response:', qdrantResponse);

    return {
      message: 'Document uploaded successfully',
      data: response,
      qdrantResponse: qdrantResponse,
    };
  }
}
