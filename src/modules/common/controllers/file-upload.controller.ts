import {
  ApiResponseType,
  Auth,
  FilesUpload,
  UserRequest
} from '@base/decorators';
import {
  FileType,
  FileTypeSize,
  StorageFolders,
  StoragePermission,
} from '@base/enums';
import { AuthorizedContext } from '@modules/auth/types';
import { Controller, Post, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileResponseDto, FileUploadDto } from '../dto';
import { FileUploadService } from '../services';

@ApiTags('File Uploads')
@Auth()
@Controller('file-uploads')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  // @RBAC(UserRoles.ADMIN)
  @Post('profile-image')
  @ApiOperation({ summary: 'Upload user profile image' })
  @ApiResponseType(FileResponseDto)
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  @FilesUpload(
    StorageFolders.USER_AVATARS,
    [
      FileType.IMAGE_PNG,
      FileType.IMAGE_JPG,
      FileType.IMAGE_WEBP,
      FileType.IMAGE_JPEG,
    ],
    StoragePermission.PUBLIC,
    FileTypeSize.MAX_IMAGE_SIZE,
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.MulterS3.File,
    @UserRequest() context: AuthorizedContext,
  ) {
    return await this.fileUploadService.createFileUploadAsync(
      file,
      StorageFolders.USER_AVATARS,
      context,
    );
  }
}
