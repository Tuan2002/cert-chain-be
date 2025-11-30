import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Certificate } from "../entities";
import { CertificateProfileDto } from "./certificate-profile.dto";

export class CertificateBulkCreateDto extends PickType(Certificate, [
  'validFrom',
  'validTo'
]) {
  @ApiProperty({ type: CertificateProfileDto })
  @ValidateNested()
  @Expose()
  @Type(() => CertificateProfileDto)
  authorProfile: CertificateProfileDto;
}

export class MultiCertificateCreateDto {
  @ApiProperty({
    description: 'The ID of the certificate type for the certificates',
    example: 'certtype_1234567890abcdef',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  certificateTypeId: string;

  @ApiProperty({
    description: 'The ID of the organization issuing the certificates',
    example: 'org_1234567890abcdef',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  organizationId: string;

  @ApiProperty({ type: [CertificateBulkCreateDto] })
  @ValidateNested({ each: true })
  @Expose()
  @Type(() => CertificateBulkCreateDto)
  certificates: CertificateBulkCreateDto[];
}