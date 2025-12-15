import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtractionService } from './extraction.service';

@Controller()
export class ExtractionController {
  constructor(private readonly extractionService: ExtractionService) {}

  /**
   * Equivalent to the previous Python `/process-pdf/` endpoint.
   * Accepts a single uploaded file (PDF or DOCX) under the `file` field
   * and returns the extracted text in `{ text: string }` format.
   */
  @Post('process-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async processPdf(@UploadedFile() file: Express.Multer.File) {
    const text = await this.extractionService.extractText(file);
    return { text };
  }
}


