import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RevokeCertificateDto {
  @ApiProperty({ description: 'Reason for revoking the certificate' })
  @IsNotEmpty()
  @IsString()
  revokeReason: string;
}