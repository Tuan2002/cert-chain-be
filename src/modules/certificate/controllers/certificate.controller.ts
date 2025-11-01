import { ApiQueryOptions, ApiResponseType, Auth, QueryOptions, RBAC } from '@/base/decorators';
import { QueryOptionsDto } from '@/base/dtos';
import { UserRoles } from '@/modules/user/enums';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CertificateTypeDto, CreateCertificateTypeDto } from '../dto';
import { CertificateTypeService } from '../services';

@ApiTags('Certificates')
@Auth()
@Controller('certificates')
export class CertificateController {
  constructor(
    private readonly certificateTypeService: CertificateTypeService
  ) { }

  @ApiOperation({ summary: 'Create a new certificate type' })
  @ApiResponseType(CertificateTypeDto)
  @Post('types/create')
  @RBAC(UserRoles.ADMIN)
  async createCertificateType(
    @Body() createTypeDto: CreateCertificateTypeDto
  ) {
    return this.certificateTypeService.createCertificateTypeAsync(createTypeDto);
  }

  @ApiOperation({ summary: 'Get certificate types' })
  @ApiQueryOptions()
  @ApiResponseType(CertificateTypeDto, { isArray: true })
  @Get('types/get-types')
  async getCertificateTypes(
    @QueryOptions() queryOptionsDto: QueryOptionsDto
  ) {
    return this.certificateTypeService.getCertificateTypesAsync(queryOptionsDto);
  }

  @ApiOperation({ summary: 'Get certificate type by ID' })
  @ApiResponseType(CertificateTypeDto)
  @Get('types/:id')
  async getCertificateTypeById(
    @Body('id') certificateTypeId: string
  ) {
    return this.certificateTypeService.getCertificateTypeByIdAsync(certificateTypeId);
  }
}