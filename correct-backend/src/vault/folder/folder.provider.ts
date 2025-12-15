import {
  DOCUMENT_REPOSITORY,
  FOLDER_REPOSITORY,
  USER_REPOSITORY,
} from '@/core/constants';
import { Folder } from '../entities/folder.entity';
import { User } from '@/user/entity/user.entity';
import { Document } from '../entities/document.entity';

export const folderProviders = [
  {
    provide: FOLDER_REPOSITORY,
    useValue: Folder,
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: DOCUMENT_REPOSITORY,
    useValue: Document,
  },
];
