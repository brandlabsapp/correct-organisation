import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface IData {
  query: string;
  userId: number;
  sessionId?: number;
  companyId: number;
  conversationHistory?: string[];
}

@Injectable()
export class N8nService {
  constructor() {}
  async getGPTResponseN8N(data: IData): Promise<{ output: string }> {
    return new Promise((resolve, reject) => {
      const url = 'https://myna-n8n-v2.enrootmumbai.in/webhook/compliance';
      axios
        .post(url, data)
        .then(async (response: AxiosResponse) => {
          return resolve(response.data);
        })
        .catch((error: AxiosError) => {
          console.log('error', error);
          return reject(
            'Bot is not available right now, please try again later',
          );
        })
        .finally(() => {
          return reject('Error at #getConversationResponse');
        });
    });
  }
}
