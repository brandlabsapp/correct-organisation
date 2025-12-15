import { DOCUMENT_REPOSITORY } from '@/core/constants';
import { Document } from '../entities/document.entity';

export const documentProviders = [
  {
    provide: DOCUMENT_REPOSITORY,
    useValue: Document,
  },
];
