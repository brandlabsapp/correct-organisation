import { Module } from '@nestjs/common';
import { VaultService } from './vault.service';
import { VaultController } from './vault.controller';
import { FolderModule } from './folder/folder.module';
import { DocumentModule } from './document/document.module';

@Module({
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService],
  imports: [FolderModule, DocumentModule],
})
export class VaultModule {}
