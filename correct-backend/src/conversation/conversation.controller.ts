import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ai-chat')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async generateResponse(@Body() createConversationDto: CreateConversationDto) {
    try {
      const response = await this.conversationService.getResponseFromMastra(
        createConversationDto,
      );
      return response;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }

  @Post('new')
  async createNewConversation(
    @Body() body: { userId: number; companyId: number },
  ) {
    try {
      const response = await this.conversationService.createNewConversation(
        body.userId,
        body.companyId,
      );
      return response;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }

  @Get('user-company/:userId/:companyId')
  async getConversationByUserAndCompany(
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    try {
      const response =
        await this.conversationService.getConversationByUserAndCompany(
          +userId,
          +companyId,
        );
      return response;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }

  @Get()
  async findAll() {
    try {
      const response = await this.conversationService.findAll();
      return response;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const response = await this.conversationService.findOne(+id);
      return response;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    try {
      const response = await this.conversationService.update(
        +id,
        updateConversationDto,
      );
      return response;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const response = await this.conversationService.remove(+id);
      return response;
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }
}
