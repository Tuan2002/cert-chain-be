import { ApiBodyQueryOptions, ApiQueryOptions, ApiResponseType, Auth, QueryOptions, RBAC, UserRequest } from '@/base/decorators';
import { QueryOptionsDto } from '@/base/dtos';
import { AuthorizedContext } from '@/modules/auth/types';
import { UserRoles } from '@/modules/user/enums';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseCertificateDto, CertificateTypeDto, CreateCertificateDto, CreateCertificateTypeDto } from '../dto';
import { CertificateService, CertificateTypeService } from '../services';

@ApiTags('Certificates')
@Auth()
@Controller('certificates')
export class CertificateController {
  constructor(
    private readonly certificateTypeService: CertificateTypeService,
    private readonly certificateService: CertificateService
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
    @Param('id') certificateTypeId: string
  ) {
    return this.certificateTypeService.getCertificateTypeByIdAsync(certificateTypeId);
  }

  @ApiOperation({ summary: 'Update certificate type' })
  @ApiResponseType(CertificateTypeDto)
  @Put('types/:id/update')
  @RBAC(UserRoles.ADMIN)
  async updateCertificateType(
    @Param('id') certificateTypeId: string,
    @Body() updateTypeDto: CreateCertificateTypeDto
  ) {
    return this.certificateTypeService.updateCertificateTypeAsync(certificateTypeId, updateTypeDto);
  }

  @ApiOperation({ summary: 'Activate certificate type' })
  @ApiResponseType(CertificateTypeDto)
  @Put('types/:id/activate')
  @RBAC(UserRoles.ADMIN)
  async activateCertificateType(
    @Param('id') certificateTypeId: string,
  ) {
    return this.certificateTypeService.reactivateCertificateTypeAsync(certificateTypeId);
  }

  @ApiOperation({ summary: 'Deactivate certificate type' })
  @ApiResponseType(CertificateTypeDto)
  @Put('types/:id/deactivate')
  @RBAC(UserRoles.ADMIN)
  async deactivateCertificateType(
    @Param('id') certificateTypeId: string,
  ) {
    return this.certificateTypeService.deactivateCertificateTypeAsync(certificateTypeId);
  }

  @ApiOperation({ summary: 'Delete certificate type' })
  @ApiResponseType(CertificateTypeDto)
  @Delete('types/:id/delete')
  @RBAC(UserRoles.ADMIN)
  async deleteCertificateType(
    @Param('id') certificateTypeId: string,
  ) {
    return this.certificateTypeService.deleteCertificateTypeAsync(certificateTypeId);
  }

  @Post('create-certificate')
  @ApiOperation({ summary: 'Create a new certificate' })
  @ApiResponseType(BaseCertificateDto)
  async createCertificate(
    @Body() certificateData: CreateCertificateDto,
    @UserRequest() context: AuthorizedContext
  ) {
    return this.certificateService.createCertificateAsync(context.userId, certificateData);
  }

  @Post('get-certificates')
  // @RBAC(UserRoles.ADMIN)
  @ApiOperation({
    summary: 'Get all certificates with pagination',
  })
  @ApiResponseType(BaseCertificateDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  async getCertificates(
    @Body() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.certificateService.getCertificatesAsync(queryOptionsDto);
  }

  @ApiOperation({ summary: 'Get certificates of an organization with pagination' })
  @ApiResponseType(BaseCertificateDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  @Post('organization-certificates/:id')
  async getOrganizationCertificates(
    @Body() queryOptionsDto: QueryOptionsDto,
    @Param('id') organizationId: string
  ) {
    return this.certificateService.getCertificatesAsync(queryOptionsDto, organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certificate by id' })
  @ApiResponseType(BaseCertificateDto)
  async getCertificateById(
    @Param('id') id: string
  ) {
    return this.certificateService.getCertificateByIdAsync(id);
  }
}