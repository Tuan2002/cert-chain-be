import { QueryOptionsHelper } from "@/base/decorators";
import { QueryOptionsDto } from "@/base/dtos";
import { parseFilterQuery, parseSortQuery } from "@/base/utils";
import { SecurityOptions } from "@/constants";
import { OrganizationMailQueueService } from "@/modules/queue/services";
import { User } from "@/modules/user/entities";
import { UserRoles } from "@/modules/user/enums";
import { OrganizationContractService } from "@/modules/web-three/services";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcryptjs";
import { plainToInstance } from "class-transformer";
import dayjs from "dayjs";
import randomstring from "randomstring";
import { DataSource, EntityManager, ILike, Repository } from "typeorm";
import { OrganizationErrorCode } from "../constants";
import {
  RegisterOrganizationDto,
  RegistrationOrganizationDto,
  RejectRegistrationDto
} from "../dto";
import {
  Organization,
  OrganizationMember,
  OrganizationRegistration
} from "../entities";
import { RegistrationStatus } from "../enums";

@Injectable()
export class OrganizationRegistrationService {
  constructor(
    @InjectRepository(OrganizationRegistration)
    private registrationRepository: Repository<OrganizationRegistration>,
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly organizationMailQueueService: OrganizationMailQueueService,
    private readonly organizationContractService: OrganizationContractService,
  ) { }

  /**
   * Register a new organization.
   * @param registrationDto - Data for registering the organization.
   */
  async registerOrganizationAsync(registrationDto: RegisterOrganizationDto): Promise<RegistrationOrganizationDto> {
    const existingRequest = await this.registrationRepository.exists({
      where: {
        email: registrationDto.email,
        status: RegistrationStatus.PENDING
      }
    });
    if (existingRequest) {
      throw new BadRequestException({
        message: 'There is already a pending registration request with this email.'
      })
    }

    const registration = this.registrationRepository.create({
      ...registrationDto,
    });
    const savedRegistration = await this.registrationRepository.save(registration);

    // await this.organizationMailQueueService.addSendOrganizationRegisteredEmailJob({
    //   to: registrationDto.email,
    //   organizationName: registrationDto.organizationName,
    //   ownerName: `${registrationDto.ownerFirstName} ${registrationDto.ownerLastName}`,
    // });

    return plainToInstance(RegistrationOrganizationDto, savedRegistration, {
      excludeExtraneousValues: true
    });
  }

  async getRegistrationsAsync(queryOptionsDto: QueryOptionsDto) {
    const { getPagination, skip, take, search, sort, filters } =
      new QueryOptionsHelper(queryOptionsDto, {
        keepRawFilters: true
      });

    const [rawRegistrations, count] = await this.registrationRepository
      .findAndCount({
        skip,
        take,
        where: {
          ...(search
            ? { organizationName: ILike(search) }
            : {}),
          ...parseFilterQuery<OrganizationRegistration>(filters)
        },
        order: sort ? parseSortQuery<OrganizationRegistration>(sort) : { createdAt: 'DESC' },
      });

    const resPagination = getPagination({
      count,
      total: rawRegistrations.length,
    });

    const registrations = rawRegistrations.map((registration) =>
      plainToInstance(RegistrationOrganizationDto, registration, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data: registrations,
      pagination: resPagination,
    };
  }

  async getRegistrationByIdAsync(id: string): Promise<RegistrationOrganizationDto> {
    const registration = await this.registrationRepository.findOne({ where: { id } });
    if (!registration) {
      throw new BadRequestException({
        message: 'Registration request not found.',
        code: OrganizationErrorCode.ORGANIZATION_NOT_FOUND
      });
    }

    return plainToInstance(RegistrationOrganizationDto, registration, {
      excludeExtraneousValues: true
    });
  }

  async approveRegistrationAsync(id: string): Promise<{
    registrationId: string;
  }> {
    const registration = await this.registrationRepository.findOne({ where: { id } });
    if (!registration) {
      throw new BadRequestException({
        message: 'Registration request not found.',
        code: OrganizationErrorCode.ORGANIZATION_NOT_FOUND
      });
    }

    if (registration.status !== RegistrationStatus.PENDING) {
      throw new BadRequestException({
        message: 'Only pending registrations can be approved.',
        code: OrganizationErrorCode.INVALID_ORGANIZATION_STATUS
      });
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      const newOrganization = manager.create(Organization, {
        name: registration.organizationName,
        description: registration.organizationDescription,
        countryCode: registration.countryCode,
        website: registration.website,
      });

      const createdOrganization = await manager.save(Organization, newOrganization);
      const existUser = await manager.exists(User, {
        where: {
          email: registration.email,
        },
      });

      if (existUser) {
        throw new BadRequestException({
          message: 'This email is already in use',
        });
      }

      const randomPassword = randomstring.generate();
      const hashedPassword = await bcrypt.hash(
        randomPassword,
        SecurityOptions.PASSWORD_SALT_ROUNDS,
      );

      const newUser = manager.create(User, {
        firstName: registration.ownerFirstName,
        lastName: registration.ownerLastName,
        email: registration.email,
        userName: registration.email,
        phoneNumber: registration.phoneNumber,
        hashedPassword,
        role: UserRoles.ORGANIZATION,
      });
      const createdUser = await manager.save(User, newUser);

      const newOrganizationMember = manager.create(OrganizationMember, {
        organizationId: createdOrganization.id,
        userId: createdUser.id,
        walletAddress: registration.walletAddress.toLowerCase(),
        isOwner: true,
      });

      await manager.save(OrganizationMember, newOrganizationMember);
      await manager.update(OrganizationRegistration, { id }, {
        status: RegistrationStatus.APPROVED,
      });

      await this.organizationContractService.createOrganizationAsync({
        id: createdOrganization.id,
        owner: registration.walletAddress,
        name: registration.organizationName,
        countryCode: registration.countryCode,
      });

      await this.organizationMailQueueService.addSendOrganizationApprovedEmailJob({
        to: registration.email,
        organizationName: registration.organizationName,
        ownerName: `${registration.ownerFirstName} ${registration.ownerLastName}`,
        approvedAt: createdOrganization.createdAt,
        account: registration.email,
        password: randomPassword,
      });
    });
    return { registrationId: registration.id };
  }

  async rejectRegistrationAsync(id: string, rejectRegistrationDto: RejectRegistrationDto): Promise<void> {
    const registration = await this.registrationRepository.findOne({ where: { id } });
    if (!registration) {
      throw new BadRequestException({
        message: 'Registration request not found.',
        code: OrganizationErrorCode.ORGANIZATION_NOT_FOUND
      });
    }

    if (registration.status !== RegistrationStatus.PENDING) {
      throw new BadRequestException({
        message: 'Only pending registrations can be rejected.',
        code: OrganizationErrorCode.INVALID_ORGANIZATION_STATUS
      });
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      await this.organizationMailQueueService.addSendOrganizationRejectedEmailJob({
        to: registration.email,
        organizationName: registration.organizationName,
        ownerName: `${registration.ownerFirstName} ${registration.ownerLastName}`,
        rejectedAt: dayjs().toDate(),
        reason: rejectRegistrationDto.rejectReason,
      });

      await manager.update(OrganizationRegistration, { id }, {
        status: RegistrationStatus.REJECTED,
        rejectReason: rejectRegistrationDto.rejectReason,
      });
    });
  }
}