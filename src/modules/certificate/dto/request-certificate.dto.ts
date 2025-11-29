import { PickType } from "@nestjs/swagger";
import { CertificateRequest } from "../entities";

export class RequestCertificateDto extends PickType(CertificateRequest, [
  'requestType',
  'certificateId',
  'revokeReason',
]) { }

export class RejectCertificateRequestDto extends PickType(CertificateRequest, [
  'rejectionReason',
]) { }