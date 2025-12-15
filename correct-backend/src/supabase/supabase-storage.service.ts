import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  SupabaseClient,
  SupabaseClientOptions,
} from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseApiKey = this.configService.get<string>('supabase.apiKey');

    if (!supabaseUrl || !supabaseApiKey) {
      throw new Error('Supabase URL and API Key must be provided');
    }

    const options: SupabaseClientOptions<'public'> = {
      auth: {
        persistSession: false,
      },
    };

    this.client = createClient(supabaseUrl, supabaseApiKey, options);
  }

  async upload(filePath: string, buffer: Buffer, contentType: string) {
    try {
      this.logger.debug(`Uploading file to: ${filePath}`);

      const { data, error } = await this.client.storage
        .from('correct-dev')
        .upload(filePath, buffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        this.logger.error('Error uploading file to Supabase', error);
        throw error;
      }

      this.logger.debug(`File uploaded successfully: ${data.path}`);

      const {
        data: { publicUrl },
      } = this.client.storage.from('correct-dev').getPublicUrl(data.path);

      return {
        url: publicUrl,
        key: data.path,
      };
    } catch (error) {
      this.logger.error(
        'An unexpected error occurred during file upload',
        error,
      );
      throw error;
    }
  }
}
