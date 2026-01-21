import { N8nService } from './../n8n/n8n.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/conversationMessages.entity';
import {
  CONVERSATION_MESSAGES_REPOSITORY,
  CONVERSATION_REPOSITORY,
} from '@/core/constants';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { MastraService } from '@/mastra/mastra.service';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: typeof Conversation,
    @Inject(CONVERSATION_MESSAGES_REPOSITORY)
    private readonly conversationMessageRepository: typeof ConversationMessage,
    private readonly n8nService: N8nService,
    private readonly mastraService: MastraService,
  ) {}

  async getResponseFromMastra(createConversationDto: any) {
    try {
      const { userId, companyId, messages, conversationId } =
        createConversationDto;
      let conversation: Conversation | null = null;

      console.log('createConversationDto', createConversationDto);

      console.log('messages', messages);

      if (!conversationId) {
        conversation = await this.conversationRepository.create({
          userId,
          companyId,
          startDate: new Date(),
          endDate: new Date(),
        });
      } else {
        conversation = await this.conversationRepository.findByPk(
          conversationId,
          {
            include: [{ model: ConversationMessage, as: 'messages' }],
          },
        );
      }
      const latestMessage =
        messages.length > 0 ? messages[messages.length - 1] : messages[0];

      const agentId = 'orchestratorAgent';
      const mastraResponse = await this.mastraService.generateResponse(
        agentId,
        [latestMessage.content],
        String(conversation.id),
      );

      if (!mastraResponse) {
        throw new BadRequestException('GPT response not received');
      }
      const extractedToolResults = Array.isArray(mastraResponse?.steps)
        ? mastraResponse.steps.flatMap((s: any) => s?.toolResults || [])
        : undefined;
      const normalizedToolResults =
        extractedToolResults && extractedToolResults.length
          ? extractedToolResults
          : null;

      const conversationMessage =
        await this.conversationMessageRepository.create({
          conversationId: conversation.id,
          userContent: latestMessage.content,
          botContent: mastraResponse?.text,
          timestamp: new Date(),
          agentId: agentId,
          threadId: String(conversation.id),
          resourceId: String(conversation.id),
          usage: mastraResponse?.usage || null,
          toolResults: normalizedToolResults,
        });

      return {
        conversation: conversation,
        messageId: conversationMessage.uuid,
        botContent: mastraResponse.text,
      };
    } catch (error) {
      this.logger.error(
        error.message,
        'createConversation',
        'ConversationService',
      );
      throw error;
    }
  }

  /**
   * Create a new conversation only (without GPT response)
   */
  async createNewConversation(userId: number, companyId: number) {
    try {
      const conversation = await this.conversationRepository.create({
        userId,
        companyId,
        startDate: new Date(),
        endDate: new Date(),
      });

      if (!conversation) {
        throw new BadRequestException('Conversation not created');
      }

      this.logger.log(
        `Created new conversation ${conversation.id} for user ${userId} and company ${companyId}`,
      );

      return conversation;
    } catch (error) {
      this.logger.error(
        error.message,
        'createNewConversation',
        'ConversationService',
      );
      throw error;
    }
  }

  async getConversationByUserAndCompany(userId: number, companyId: number) {
    try {
      const response = await this.conversationRepository.findAll({
        where: {
          userId,
          companyId,
        },
        order: [['createdAt', 'DESC']],
        include: [ConversationMessage],
      });

      if (!response) {
        this.logger.error(
          'No conversation found',
          'getConversationByUserAndCompany',
          'ConversationService',
        );
        throw new BadRequestException('No conversation found');
      }
      return response;
    } catch (error) {
      this.logger.error(
        error.message,
        'getConversationByUserAndCompany',
        'ConversationService',
      );
      throw error;
    }
  }

  async findAll() {
    try {
      const conversations = await this.conversationRepository.findAll();
      if (!conversations) {
        this.logger.error(
          'No conversations found',
          'findAll',
          'ConversationService',
        );
        throw new BadRequestException('No conversations found');
      }
      return conversations;
    } catch (error) {
      this.logger.error(error.message, 'findAll', 'ConversationService');
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const conversation = await this.conversationRepository.findByPk(id);
      if (!conversation) {
        this.logger.error(
          'Conversation not found',
          'findOne',
          'ConversationService',
        );
        throw new BadRequestException('Conversation not found');
      }
      return conversation;
    } catch (error) {
      this.logger.error(error.message, 'findOne', 'ConversationService');
      throw error;
    }
  }

  async update(id: number, updateConversationDto: UpdateConversationDto) {
    try {
      const conversation = await this.conversationRepository.findByPk(id);
      if (!conversation) {
        this.logger.error(
          'Conversation not found',
          'update',
          'ConversationService',
        );
        throw new BadRequestException('Conversation not found');
      }
      await conversation.update(updateConversationDto as any);
      return conversation;
    } catch (error) {
      this.logger.error(error.message, 'update', 'ConversationService');
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const conversation = await this.conversationRepository.findByPk(id);
      if (!conversation) {
        throw new BadRequestException('Conversation not found');
      }
      await conversation.destroy();
      return conversation;
    } catch (error) {
      this.logger.error(error.message, 'remove', 'ConversationService');
      throw error;
    }
  }
}
