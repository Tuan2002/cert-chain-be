import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddOrganizationMemberDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Wallet address' })
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty({ description: 'First name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  @IsOptional()
  @IsDateString()
  dob?: Date;
}