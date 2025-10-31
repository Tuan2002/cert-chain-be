import { ApiBodyQueryOptions, ApiResponseType, RBAC, UserRequest } from '@/base/decorators';
import { QueryOptionsDto } from '@/base/dtos';
import { AuthorizedContext } from '@/modules/auth/types';
import { UserRoles } from '@/modules/user/enums';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterOrganizationDto, RegistrationOrganizationDto, RejectRegistrationDto } from '../dto';
import { OrganizationRegistrationService, OrganizationService } from '../services';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationRegistrationService: OrganizationRegistrationService,
    private readonly organizationService: OrganizationService
  ) { }

  @ApiOperation({
    summary: 'Get all organization with pagination',
  })
  @ApiResponseType(RegistrationOrganizationDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  @Post('get-organizations')
  @RBAC(UserRoles.ADMIN)
  async getOrganizations(
    @Body() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.organizationService.getOrganizationsAsync(queryOptionsDto);
  }

  @ApiOperation({
    summary: 'Get my organizations with pagination',
  })
  @ApiResponseType(RegistrationOrganizationDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  @Post('my-organizations')
  @RBAC(UserRoles.ORGANIZATION)
  async getMyOrganizations(
    @Body() queryOptionsDto: QueryOptionsDto,
    @UserRequest() context: AuthorizedContext
  ) {
    return this.organizationService.getUserOrganizationsAsync(context.userId, queryOptionsDto);
  }

  @ApiOperation({ summary: 'Register a new organization' })
  @ApiResponseType(RegistrationOrganizationDto)
  @Post('register')
  async registerOrganization(
    @Body() registrationDto: RegisterOrganizationDto
  ) {
    return this.organizationRegistrationService.registerOrganizationAsync(registrationDto);
  }

  @Post('registrations')
  @RBAC(UserRoles.ADMIN)
  @ApiOperation({
    summary: 'Get all organization registrations with pagination',
  })
  @ApiResponseType(RegistrationOrganizationDto,
    { isArray: true, hasPagination: true }
  )
  @ApiBodyQueryOptions()
  async getOrganizationRegistrations(
    @Body() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.organizationRegistrationService.getRegistrationsAsync(queryOptionsDto);
  }

  @Get('registrations/:id')
  @RBAC(UserRoles.ADMIN)
  @ApiOperation({
    summary: 'Get organization registration by id',
  })
  @ApiResponseType(RegistrationOrganizationDto)
  async getOrganizationRegistrationById(
    @Param('id') id: string
  ) {
    return this.organizationRegistrationService.getRegistrationByIdAsync(id);
  }

  @Put('registrations/:id/approve')
  @RBAC(UserRoles.ADMIN)
  @ApiOperation({
    summary: 'Approve organization registration',
  })
  async approveOrganizationRegistration(
    @Param('id') id: string
  ) {
    return this.organizationRegistrationService.approveRegistrationAsync(id);
  }

  @Put('registrations/:id/reject')
  @RBAC(UserRoles.ADMIN)
  @ApiOperation({
    summary: 'Reject organization registration',
  })
  async rejectOrganizationRegistration(
    @Param('id') id: string,
    @Body() rejectRegistrationDto: RejectRegistrationDto
  ) {
    return this.organizationRegistrationService.rejectRegistrationAsync(id, rejectRegistrationDto);
  }
}