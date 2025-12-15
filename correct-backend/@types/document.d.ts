declare namespace Document {
  export interface Document {
    name: string;
    userId?: number;
    companyId?: number;
    source: string;
    description: string;
    complianceId?: number;
    folderId?: number;
    url: string;
    key: string;
    filetype: string;
    extension: string;
    category?: string;
    tags?: string[];
    size: number;
    companyMemberId?: number;
    value?: string;
    type?: string;
    verified?: boolean;
    uploadedAt?: Date;
    description?: string;
    folderId?: number;
  }
}
