import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – runtime dependency, types may not be available
import Tesseract from 'tesseract.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – runtime dependency, types may not be available
import { fromBuffer } from 'pdf2pic';

@Injectable()
export class ExtractionService {
  async extractText(file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      const dataBuffer = file.buffer;
      const data = await pdfParse(dataBuffer);

      const parsedText = data.text?.trim();
      if (parsedText) {
        // Normal (non-scanned) PDF with embedded text
        return parsedText;
      }

      // Fallback: scanned / image-based PDF → OCR with Tesseract
      const ocrText = await this.extractTextFromScannedPdf(file);
      return ocrText;
    }

    if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }

    return null;
  }

  /**
   * Uses pdf2pic to render each PDF page as an image and Tesseract to
   * perform OCR on those images. This is designed for scanned PDFs that
   * don't contain any embedded text.
   */
  private async extractTextFromScannedPdf(
    file: Express.Multer.File,
  ): Promise<string | null> {
    const convert = fromBuffer(file.buffer, {
      density: 200,
      format: 'png',
      width: 1240,
      height: 1754,
      quality: 80,
      responseType: 'buffer',
    } as any);

    let page = 1;
    let combinedText = '';

    // Iterate over pages until pdf2pic throws (no more pages)
    // or returns a falsy result.
    // We keep it defensive so it degrades gracefully.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const result: any = await (convert as any)(page);
        const imageBuffer: Buffer | undefined = result?.buffer;

        if (!imageBuffer) {
          break;
        }

        const ocr = await Tesseract.recognize(imageBuffer, 'eng');
        if (ocr?.data?.text) {
          combinedText += `\n${ocr.data.text}`;
        }

        page += 1;
      } catch {
        // Likely ran out of pages or conversion failed; stop gracefully.
        break;
      }
    }

    const finalText = combinedText.trim();
    return finalText || null;
  }
}
