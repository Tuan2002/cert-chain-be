import { AbstractEntity } from "@/base/entities/base.entity";
import { Tables } from "@/enums/tables.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column, Entity } from "typeorm";
import { RegistrationStatus } from "../enums/registration-status.enum";

@Entity(Tables.OrganizationRegistration)
export class OrganizationRegistration extends AbstractEntity {
  @ApiProperty({
    description: 'Wallet address of the organization owner',
    example: '0xd48AB4C6fDf56f05E8237885eB040e9670d0feeb',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  walletAddress: string;

  @ApiProperty({
    description: 'First name of the organization owner',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  ownerFirstName: string;

  @ApiProperty({
    description: 'Last name of the organization owner',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  ownerLastName: string;

  @ApiProperty({
    description: 'Email address of the organization owner',
    example: 'example@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  @Column()
  email: string;

  @ApiProperty({
    description: 'Phone number of the organization owner',
    example: '084123456789',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  phoneNumber: string;

  @ApiProperty({
    description: 'Name of the organization',
    example: 'Vietnam Community Software',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  organizationName: string;

  @ApiProperty({
    description: 'Description of the organization',
    example: 'A community for software developers in Vietnam',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  organizationDescription?: string;

  @ApiProperty({
    description: 'Website URL of the organization',
    example: 'https://vcsoft.com',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  website?: string;

  @ApiProperty({
    description: 'Country code of the organization',
    example: 'VN',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  countryCode: string;

  @ApiProperty({
    description: 'Status of the organization registration',
    example: RegistrationStatus.PENDING,
    enum: RegistrationStatus,
  })
  @IsEnum(RegistrationStatus)
  @Expose()
  @Column({
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING
  })
  status: RegistrationStatus;

  @ApiProperty({
    description: 'Reason for rejection if the registration is rejected',
    example: 'Invalid documents provided',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({ nullable: true })
  rejectReason?: string;
}