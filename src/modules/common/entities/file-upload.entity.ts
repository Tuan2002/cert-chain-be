import { Tables } from '@/enums/tables.enum';
import { AbstractEntity } from '@base/entities/base.entity';
import { StorageFolders } from '@base/enums';
import { User } from '@modules/user/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FileUploadStatus } from '../enums';

@Entity(Tables.FileUpload)
export class FileUpload extends AbstractEntity {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Column()
  originalName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Column()
  bucketName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Column({ unique: true })
  fileKey: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Column()
  mimeType: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Column()
  size: number;

  @ApiProperty({
    enum: StorageFolders,
    enumName: 'StorageFolders',
  })
  @Expose()
  @IsEnum(StorageFolders)
  @Column({
    enum: StorageFolders,
  })
  storageFolder: StorageFolders;

  @ApiProperty({
    enum: FileUploadStatus,
    enumName: 'FileUploadStatus',
  })
  @Expose()
  @IsEnum(FileUploadStatus)
  @Column({
    enum: FileUploadStatus,
    default: FileUploadStatus.UPLOADED,
  })
  status: FileUploadStatus;

  @ApiProperty()
  @IsString()
  @Expose()
  @Column()
  uploaderId: string;

  // Relations
  @ManyToOne(() => User, (user) => user.fileUploads, {
    nullable: false,
  })
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;
}
