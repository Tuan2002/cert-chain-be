import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @IsNotEmpty()
  @ApiProperty({ format: 'binary' })
  file: Express.MulterS3.File;
}

export class FileResponseDto {
  @ApiProperty()
  @Expose()
  originalName: string;

  @ApiProperty()
  @Expose()
  publicUrl?: string;

  @ApiProperty()
  @Expose()
  fileKey: string;

  @ApiProperty()
  @Expose()
  mimeType: string;

  @ApiProperty()
  @Expose()
  size: number;
}
