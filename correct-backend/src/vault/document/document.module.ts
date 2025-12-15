import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { documentProviders } from './document.provider';
import { DocumentController } from './document.controller';
import { SupabaseStorageService } from '@/supabase/supabase-storage.service';
import { ExtractionService } from '@/extraction/extraction.service';
import { QdrantService } from '@/qdrant/qdrant.service';

@Module({
  providers: [
    DocumentService,
    ...documentProviders,
    SupabaseStorageService,
    ExtractionService,
    QdrantService,
  ],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
