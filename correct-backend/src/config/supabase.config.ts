import { registerAs } from '@nestjs/config';

export default registerAs('supabase', () => ({
  url: process.env.SUPABASE_URL,
  apiKey: process.env.SUPABASE_ANON_KEY,
}));
