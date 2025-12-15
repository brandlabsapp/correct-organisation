import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import supabaseConfig from '@/config/supabase.config';
import { SupabaseStorageService } from './supabase-storage.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [supabaseConfig],
    }),
  ],
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class SupabaseModule {}
