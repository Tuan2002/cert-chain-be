import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { Certificate } from "../entities";
import { CertificateProfileDto } from "./certificate-profile.dto";

export class CreateCertificateDto extends PickType(Certificate, [
  'organizationId',
  'certificateTypeId',
  'validFrom',
  'validTo'
]) {
  @ApiProperty({ type: CertificateProfileDto })
  @ValidateNested()
  @Expose()
  @Type(() => CertificateProfileDto)
  authorProfile: CertificateProfileDto;
}