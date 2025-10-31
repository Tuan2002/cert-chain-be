import { QueryOptionsHelper } from "@/base/decorators";
import { QueryOptionsDto } from "@/base/dtos";
import { parseFilterQuery, parseSortQuery } from "@/base/utils";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { ILike, Repository } from "typeorm";
import { OrganizationDto } from "../dto/organization.dto";
import { Organization } from "../entities";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>
  ) { }

  async getOrganizationsAsync(queryOptionsDto: QueryOptionsDto) {
    const { getPagination, skip, take, search, sort, filters } =
      new QueryOptionsHelper(queryOptionsDto, {
        keepRawFilters: true
      });

    const [rawOrganizations, count] = await this.organizationRepository
      .findAndCount({
        where: {
          ...(search
            ? [
              { name: ILike(search) },
              { description: ILike(search) },
              { website: ILike(search) },
              { countryCode: ILike(search) }
            ]
            : {}),
          ...parseFilterQuery<Organization>(filters)
        },
        order: sort
          ? parseSortQuery<Organization>(sort)
          : { createdAt: 'DESC' },
        skip,
        take,
      });

    const resPagination = getPagination({
      count,
      total: rawOrganizations.length,
    });

    const organizations = rawOrganizations.map((organization) =>
      plainToInstance(OrganizationDto, organization, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data: organizations,
      pagination: resPagination,
    };
  }

  async getUserOrganizationsAsync(userId: string, queryOptionsDto: QueryOptionsDto) {
    const { getPagination, skip, take, search, filters } =
      new QueryOptionsHelper(queryOptionsDto, {
        keepRawFilters: true
      });

    const queryBuilder = this.organizationRepository
      .createQueryBuilder('organization')
      .innerJoin('organization.members', 'member', 'member.userId = :userId', { userId })
      .select(['organization', 'member.userId']);

    if (search) {
      queryBuilder.andWhere(
        `(organization.name ILIKE :search 
        OR organization.description ILIKE :search 
        OR organization.website ILIKE :search 
        OR organization.countryCode ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    Object.entries(parseFilterQuery<Organization>(filters)).forEach(([key, value]) => {
      queryBuilder.andWhere(`organization.${key} = :${key}`, { [key]: value });
    });
    queryBuilder.addOrderBy('organization.createdAt', 'DESC');

    const [rawOrganizations, count] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const resPagination = getPagination({
      count,
      total: rawOrganizations.length,
    });

    const organizations = rawOrganizations.map((organization) =>
      plainToInstance(OrganizationDto, {
        ...organization,
        isOwner: organization?.members.some((member) => member.userId === userId),
      }, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data: organizations,
      pagination: resPagination,
    };
  }
}