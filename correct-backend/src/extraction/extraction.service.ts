import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

@Injectable()
export class ExtractionService {
  async extractText(file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      const dataBuffer = file.buffer;
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }
    return null;
  }
}
