import { ApiBodyQueryOptions, ApiQueryOptions, ApiResponseType, Auth, QueryOptions, RBAC, UserRequest } from '@/base/decorators';
import { QueryOptionsDto } from '@/base/dtos';
import { AuthorizedContext } from '@/modules/auth/types';
import { UserRoles } from '@/modules/user/enums';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseCertificateDto, CertificateDto, CertificateRequestDto, CertificateTypeDto, CreateCertificateDto, CreateCertificateTypeDto, RequestCertificateDto } from '../dto';
import { CertificateRequestService, CertificateService, CertificateTypeService } from '../services';

@ApiTags('Certificates')
@Controller('certificates')
@Auth()
export class CertificateController {
  constructor(
    private readonly certificateTypeService: CertificateTypeService,
    private readonly certificateService: CertificateService,
    private readonly certificateRequestService: CertificateRequestService
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
  @ApiResponseType(CertificateDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  async getCertificates(
    @Body() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.certificateService.getCertificatesAsync(queryOptionsDto);
  }

  @ApiOperation({ summary: 'Get certificates of an organization with pagination' })
  @ApiResponseType(CertificateDto,
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

  @ApiOperation({ summary: 'Get certificate by id' })
  @ApiResponseType(CertificateDto)
  @Get('by-id/:id')
  async getCertificateById(
    @Param('id') id: string
  ) {
    return this.certificateService.getCertificateByIdAsync(id);
  }

  @ApiOperation({ summary: 'Submit certificate for verification or revocation' })
  @Post('submit-certificate')
  @ApiResponseType(CertificateRequestDto)
  async submitCertificate(
    @Body() requestData: RequestCertificateDto
  ) {
    return this.certificateRequestService.createCertificateRequest(requestData);
  }

  @ApiOperation({ summary: 'Get certificate requests with pagination' })
  @ApiResponseType(CertificateRequestDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  @RBAC(UserRoles.ADMIN)
  @Post('certificate-requests')
  async getCertificateRequests(
    @Body() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.certificateRequestService.getCertificateRequests(queryOptionsDto);
  }

  @ApiOperation({ summary: 'Get certificate requests for a specific certificate with pagination' })
  @ApiResponseType(CertificateRequestDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  @Post('certificate-requests/:id/certificate')
  async getCertificateRequestsByCertificateId(
    @Body() queryOptionsDto: QueryOptionsDto,
    @Param('id') certificateId: string
  ) {
    return this.certificateRequestService.getCertificateRequests(queryOptionsDto, certificateId);
  }

  @ApiOperation({ summary: 'Get certificate request by id' })
  @ApiResponseType(CertificateRequestDto)
  @Get('certificate-requests/:id')
  async getCertificateRequestById(
    @Param('id') id: string
  ) {
    return this.certificateRequestService.getCertificateRequestById(id);
  }

  @ApiOperation({ summary: 'Approve certificate request' })
  @Put('certificate-requests/:id/approve')
  @RBAC(UserRoles.ADMIN)
  async approveCertificateRequest(
    @Param('id') certificateRequestId: string
  ) {
    return this.certificateRequestService.approveCertificateRequest(certificateRequestId);
  }
}