import { IsString, IsOptional, IsNumber } from 'class-validator';

export class FolderDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  parentId: number;
}

export class UpdateFolderDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
}
