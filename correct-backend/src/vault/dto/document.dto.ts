import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class DocumentDto {
  @IsString()
  @Transform(({ value }) => String(value.trim()))
  name: string;
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  userId: number;
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  companyId: number;
  @IsString()
  @IsOptional()
  source: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  complianceId: number;
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  folderId: number;
  @IsString()
  @IsOptional()
  url: string;
  @IsString()
  @IsOptional()
  key: string;
  @IsString()
  @IsOptional()
  filetype: string;
  @IsString()
  @IsOptional()
  extension: string;
  @IsString()
  @IsOptional()
  category: string;
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => String(v));
    if (value === undefined || value === null) return [];
    return [String(value)];
  })
  tags: string[];
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size: number;
}
export class GeneratePresignedUrlDto {
  @IsString()
  fileName: string;
  @IsString()
  fileType: string;
  @IsOptional()
  @IsString()
  folder: string;
}

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  url: string;
  @IsString()
  @IsOptional()
  key: string;
  @IsString()
  @IsOptional()
  filetype: string;
}

export class uploadDocument {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  userId: number;
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  companyId: number;
  @IsString()
  @IsOptional()
  source: string;
}
