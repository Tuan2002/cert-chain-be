import { GetObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SecurityOptions } from '@constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3FileService {
  private s3Client: S3Client;
  private s3: S3;
  constructor() {
    this.s3Client = new S3Client({
      endpoint: process.env.DO_SPACE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
      },
      region: process.env.DO_SPACE_REGION,
    });

    this.s3 = new S3({
      endpoint: process.env.DO_SPACE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
      },
      region: process.env.DO_SPACE_REGION,
    });
  }

  async generateSignedUrlAsync(fileKey: string, expiresIn?: number) {
    const command = new GetObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresIn || SecurityOptions.FILE_SIGN_TIME,
    });

    return signedUrl;
  }

  async getFileStreamAsync(fileKey: string) {
    const { Body } = await this.s3.getObject({
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Key: fileKey,
    });
    if (!Body) {
      return null;
    }
    return await Body.transformToByteArray();
  }
}
