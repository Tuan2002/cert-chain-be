import { OrganizationDto } from "@/modules/organization/dto";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { CertificateRequest } from "../entities";
import { CertificateDto } from "./certificate.dto";

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
]) {
  @ApiProperty({
    description: 'Details of the certificate request',
    type: CertificateDto,
  })
  @Type(() => CertificateDto)
  @Expose()
  certificate?: CertificateDto;

  @ApiProperty({
    description: 'Details of the organization making the request',
    type: OrganizationDto,
  })
  @Type(() => OrganizationDto)
  @Expose()
  organization?: OrganizationDto;
}