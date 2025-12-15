import { BadRequestException, Injectable } from '@nestjs/common';
import { MastraClient } from '@mastra/client-js';
import { AGENT_ID } from '@/core/constants';

@Injectable()
export class MastraService {
  private mastraClient: MastraClient;

  constructor() {
    this.mastraClient = new MastraClient({
      baseUrl: process.env.MASTRA_API_URL || 'http://localhost:4111',
    });
  }
  async getAllAgents() {
    const agents = await this.mastraClient.getAgents();
    console.log(agents);
    return agents;
  }

  async getAgentById(id: string) {
    const agent = await this.mastraClient.getAgent(id);
    return agent;
  }

  async generateResponse(
    agentId: string,
    messages: string[],
    conversationId: string,
    metadata?: any,
  ) {
    if (!agentId) {
      agentId = AGENT_ID;
    }
    if (!messages) {
      throw new BadRequestException('Messages are required');
    }
    if (!conversationId) {
      throw new BadRequestException('Conversation ID is required');
    }
    const agent = await this.getAgentById(agentId);
    const response = await agent.generate({
      messages,
      threadId: conversationId,
      resourceId: conversationId,
      runTimeContext: metadata,
    });
    return response;
  }
}
