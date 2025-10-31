import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";
import { Organization } from "../entities";

export class OrganizationDto extends PickType(Organization, [
  "id",
  "name",
  'description',
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
}