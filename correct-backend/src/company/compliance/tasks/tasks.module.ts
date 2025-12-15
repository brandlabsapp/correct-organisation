import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { taskProviders } from './tasks.provider';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  providers: [TasksService, ...taskProviders],
  controllers: [TasksController],
  exports: [TasksService],
  imports: [SupabaseModule],
})
export class TasksModule {}
