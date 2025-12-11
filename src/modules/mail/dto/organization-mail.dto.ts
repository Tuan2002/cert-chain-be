import { IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendOrgRegisteredMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsString()
  @IsNotEmpty()
  organizationName: string;
}

export class SendOrgApprovedMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsDateString()
  approvedAt: Date;

  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SendOrgRejectedMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsDateString()
  rejectedAt: Date;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class SendManagerAddedMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  managerName: string;

  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsDateString()
  addedAt: Date;

  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}