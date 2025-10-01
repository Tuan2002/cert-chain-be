import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadController } from './controllers/file-upload.controller';
import { FileUpload } from './entities';
import { FileUploadService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([FileUpload]), SharedModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class CommonModule { }
