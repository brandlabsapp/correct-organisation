import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { conversationProviders } from './conversation.provider';
import { N8nModule } from '@/n8n/n8n.module';
import { MastraService } from '@/mastra/mastra.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ...conversationProviders, MastraService],
  imports: [N8nModule],
  exports: [ConversationService],
})
export class ConversationModule {}
