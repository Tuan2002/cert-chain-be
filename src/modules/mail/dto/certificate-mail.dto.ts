import { IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendCertificateApprovedMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @IsString()
  @IsNotEmpty()
  certificateType: string;

  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsDateString()
  approvedAt: Date;

  @IsDateString()
  validFrom: Date;

  @IsDateString()
  validTo: Date;

  @IsString()
  @IsNotEmpty()
  certificateCode: string;

  @IsString()
  @IsNotEmpty()
  qrCodeUrl: string;

  @IsString()
  @IsNotEmpty()
  approvalTxHash: string;
}