import { Module } from '@nestjs/common';
import { IPFSService, S3FileService } from './services';

@Module({
  imports: [],
  controllers: [],
  providers: [ S3FileService, IPFSService],
  exports: [ S3FileService, IPFSService],
})
export class ThirdPartyModule {}
