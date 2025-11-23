import { PickType } from "@nestjs/swagger";
import { CertificateRequest } from "../entities";

export class CertificateRequestDto extends PickType(CertificateRequest, [
  'id',
  'requestType',
  'certificateId',
  'organizationId',
  'status',
  'requestedTime',
  'rejectionReason',
  'createdAt',
  'updatedAt'
]) { }