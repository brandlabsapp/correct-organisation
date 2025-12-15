import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class QdrantService {
  constructor() {}

  private embeddings = openai.embeddings;

  private qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    https: true,
  });

  private async embedDocument(document: string) {
    return await this.embeddings.create({
      model: 'text-embedding-3-small',
      input: document,
    });
  }

  async addDocument(
    collection: string,
    document: string,
    metadata: Record<string, any>,
  ) {
    const embedding = await this.embedDocument(document);
    await this.qdrantClient.upsert(collection, {
      points: [
        {
          id: randomUUID(),
          vector: embedding.data[0].embedding,
          payload: { metadata: metadata, content: document },
        },
      ],
    });
  }

  async search(
    collection: string,
    query: string,
    filters: Record<string, any> = {},
    topK: number = 5,
  ) {
    const queryEmbedding = await this.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const retrievedDocs = await this.qdrantClient.search(collection, {
      vector: queryEmbedding.data[0].embedding,
      limit: topK,
      filter: filters,
      with_payload: true,
      with_vector: false,
    });

    return retrievedDocs;
  }
}
