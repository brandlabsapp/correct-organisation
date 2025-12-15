import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export interface GeneratePresignedUrlParams {
  fileName: string;
  fileType: string;
  folder?: string;
}

export async function generatePresignedUrl(params: GeneratePresignedUrlParams) {
  const { fileName, fileType, folder = '' } = params;

  const key = folder
    ? `${folder}/${Date.now()}-${fileName}`
    : `${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return {
      presignedUrl,
      key,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

export async function getPresignedUrlUsingKey(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

export async function uploadFileToS3UsingPresignedUrl(params: {
  presignedUrl: string;
  file: File;
}) {
  try {
    const { presignedUrl, file } = params;

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to S3');
    }

    return response;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}
