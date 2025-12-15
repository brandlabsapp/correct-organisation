import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { folderProviders } from './folder.provider';

@Module({
  providers: [FolderService, ...folderProviders],
  exports: [FolderService],
})
export class FolderModule {}
