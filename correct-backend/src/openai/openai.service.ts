import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private client;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
  }
  async extractJsonFromGPT(text: string, gptPrompt: string): Promise<JSON> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      const systemContent: OpenAI.Chat.ChatCompletionSystemMessageParam = {
        role: 'system',
        content: gptPrompt,
      };
      const userContent: OpenAI.Chat.ChatCompletionUserMessageParam = {
        role: 'user',
        content: text,
      };
      messages.push(systemContent, userContent);

      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: 'gpt-4-0125-preview',
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      };

      const response = await this.client.chat.completions.create(params);

      return JSON.parse(response.choices[0].message.content).references;
    } catch (err) {
      console.log('error', err);
      throw new Error('Error extracting JSON from GPT');
    }
  }
}
