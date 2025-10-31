import { PickType } from "@nestjs/swagger";
import { OrganizationRegistration } from "../entities";

export class RegisterOrganizationDto extends PickType(OrganizationRegistration, [
  'walletAddress',
  'ownerFirstName',
  'ownerLastName',
  'email',
  'organizationName',
  'organizationDescription',
  'countryCode',
  'phoneNumber',
  'website'
]) {}