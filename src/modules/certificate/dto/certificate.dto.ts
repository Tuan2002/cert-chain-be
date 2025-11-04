import { PickType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { Certificate } from "../entities";
import { CertificateProfileDto } from "./certificate-profile.dto";
import { CertificateTypeDto } from "./certificate-type.dto";

export class BaseCertificateDto extends PickType(Certificate, [
  'id',
  'code',
  'organizationId',
  'certificateTypeId',
  'issuerId',
  'status',
  'certificateHash',
  'validFrom',
  'validTo',
  'approvedAt',
  'revokedAt',
  'signedTxHash',
  'approvedTxHash',
  'revokedTxHash',
  'createdAt',
  'updatedAt'
]) {
  @Type(() => CertificateTypeDto)
  @Expose()
  certificateType: CertificateTypeDto;
}

export class CertificateDto extends BaseCertificateDto {
  @Type(() => CertificateProfileDto)
  @Expose()
  authorProfile: CertificateProfileDto;
}