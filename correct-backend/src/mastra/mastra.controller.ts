import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { MastraService } from './mastra.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from '@/company/company.service';
@Controller('mastra')
@ApiTags('ai-chat')
export class MastraController {
  constructor(
    private readonly mastraService: MastraService,
    private readonly companyService: CompanyService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  async getAllAgents() {
    const agents = await this.mastraService.getAllAgents();
    return agents;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get an agent by ID' })
  async getAgentById(@Param('id') id: string) {
    const agent = await this.mastraService.getAgentById(id);
    return agent;
  }
  @Post('generate')
  @ApiOperation({ summary: 'Generate a response from an agent' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'enum', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
          },
        },
        conversationId: { type: 'string' },
      },
    },
  })
  async generateResponse(
    @Body()
    body: {
      agentId?: string;
      messages: string[];
      conversationId?: string;
      metadata?: any;
    },
  ): Promise<any> {
    const { agentId, messages, conversationId, metadata } = body;
    const response = await this.mastraService.generateResponse(
      agentId,
      messages,
      conversationId,
      metadata,
    );
    return response;
  }
  @Get('fetch-company-details/:companyId')
  @ApiOperation({ summary: 'Fetch company details from Mastra' })
  async fetchCompanyDetails(@Param('companyId') companyId: string) {
    // const parsedCompanyId = parseInt(companyId, 10);
    const response = await this.companyService.findOneByUuid(companyId);
    return response;
  }
  @Get('fetch-all-companies-of-user/:userId')
  @ApiOperation({ summary: 'Fetch all companies of a user from Mastra' })
  async fetchAllCompaniesOfUser(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    console.log(parsedUserId);
    if (!parsedUserId) {
      throw new BadRequestException('User ID is required');
    }
    const response = await this.companyService.findAllByUserId(
      parsedUserId ?? 10,
    );
    return response;
  }
}
