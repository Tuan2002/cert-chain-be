import { PickType } from "@nestjs/swagger";
import { OrganizationRegistration } from "../entities";

export class RejectRegistrationDto extends PickType(OrganizationRegistration, [
  'rejectReason'
]) {}