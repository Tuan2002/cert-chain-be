import { BaseUserDto } from "@/modules/user/dto";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean } from "class-validator";
import { Organization } from "../entities";

export class OrganizationDto extends PickType(Organization, [
  "id",
  "name",
  'description',
  'additionalInfo',
  "website",
  "countryCode",
  "isActive",
  'initTxHash',
  'changeOwnerTxHash',
  "createdAt",
  "updatedAt",
]) {
  @ApiProperty({
    description: 'Indicates if the current user is the owner of the organization',
    example: true,
  })
  @Expose()
  @IsBoolean()
  isOwner?: boolean;

  @ApiProperty({
    description: 'Owner information of the organization',
    type: () => BaseUserDto,
  })
  @Type(() => BaseUserDto)
  @Expose()
  owner?: BaseUserDto;
}