import { PickType } from "@nestjs/swagger";
import { OrganizationRegistration } from "../entities";

export class RegistrationOrganizationDto extends PickType(OrganizationRegistration, [
  'id',
  'walletAddress',
  'ownerFirstName',
  'ownerLastName',
  'email',
  'phoneNumber',
  'organizationName',
  'organizationDescription',
  'additionalInfo',
  'countryCode',
  'website',
  'status',
  'rejectReason',
  'createdAt',
  'updatedAt',
]) { }
