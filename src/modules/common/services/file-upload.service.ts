import { StorageFolders } from '@base/enums';
import { AuthorizedContext } from '@modules/auth/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { FileResponseDto } from '../dto';
import { FileUpload } from '../entities';
import { FileUploadStatus } from '../enums';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
  ) {}

  public async createFileUploadAsync(
    fileData: Express.MulterS3.File,
    storageFolder: StorageFolders,
    context: AuthorizedContext,
  ): Promise<FileResponseDto> {
    const publicEndpoint =
      process.env.DO_SPACE_CDN_ENDPOINT ?? process.env.DO_SPACE_ENDPOINT;
    const fileUpload = this.fileUploadRepository.create({
      originalName: fileData.originalname,
      bucketName: fileData.bucket,
      fileKey: fileData.key,
      mimeType: fileData.mimetype,
      size: fileData.size,
      storageFolder: storageFolder,
      uploaderId: context.userId,
      status: FileUploadStatus.UPLOADED,
    });
    const savedFileUpload = await this.fileUploadRepository.save(fileUpload);
    return plainToInstance(
      FileResponseDto,
      {
        ...savedFileUpload,
        publicUrl: `${publicEndpoint}/${savedFileUpload.bucketName}/${savedFileUpload.fileKey}`,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
