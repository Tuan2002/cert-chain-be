import { OrganizationDto } from "@/modules/organization/dto";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { CertificateRequest } from "../entities";
import { BaseCertificateDto } from "./certificate.dto";

export class RequestCertificateDto extends PickType(CertificateRequest, [
  'requestType',
  'certificateId',
  'revokeReason',
]) {
  @ApiProperty({
    description: 'Details of the certificate request',
    type: BaseCertificateDto,
  })
  @Type(() => BaseCertificateDto)
  @Expose()
  certificate: BaseCertificateDto;

  @ApiProperty({
    description: 'Details of the organization making the request',
    type: OrganizationDto,
  })
  @Type(() => OrganizationDto)
  @Expose()
  organization: OrganizationDto;
}

export class RejectCertificateRequestDto extends PickType(CertificateRequest, [
  'rejectionReason',
]) { }