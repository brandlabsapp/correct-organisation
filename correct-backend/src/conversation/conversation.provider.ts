import { CONVERSATION_MESSAGES_REPOSITORY } from '@/core/constants';
import { CONVERSATION_REPOSITORY } from '@/core/constants';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/conversationMessages.entity';

export const conversationProviders = [
  {
    provide: CONVERSATION_REPOSITORY,
    useValue: Conversation,
  },
  {
    provide: CONVERSATION_MESSAGES_REPOSITORY,
    useValue: ConversationMessage,
  },
];
