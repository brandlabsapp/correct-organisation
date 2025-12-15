import { IsNotEmpty, IsNumber } from 'class-validator';

export class AttachDocumentDto {
  @IsNumber()
  @IsNotEmpty()
  documentId: number;
}
