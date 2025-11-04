import { AbstractEntity } from "@/base/entities/base.entity";
import { Tables } from "@/enums/tables.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { Column, Entity, OneToOne } from "typeorm";
import { Certificate } from "./certificate.entity";

@Entity(Tables.CertificateProfile)
export class CertificateProfile extends AbstractEntity {
  @ApiProperty({
    description: 'The name of the author of the certificate',
    example: 'Jane Smith',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  authorName: string;

  @ApiProperty({
    description: 'The ID card number of the author of the certificate',
    example: 'ID123456789',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  authorIdCard: string;

  @ApiProperty({
    description: 'The date of birth of the author of the certificate',
    example: '1990-05-15',
  })
  @IsNotEmpty()
  @IsDateString()
  @Expose()
  @Column()
  authorDob: Date;

  @ApiProperty({
    description: 'The email of the author of the certificate',
    example: 'example@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  @Column()
  authorEmail: string;

  @ApiProperty({
    description: 'The image URL of the author of the certificate',
    example: 'https://example.com/images/jane_smith.png',
  })
  @IsOptional()
  @IsUrl({
    require_tld: false
  })
  @Expose()
  @Column({
    nullable: true
  })
  authorImage: string;

  @ApiProperty({
    description: 'The documents of the author of the certificate',
    example: [
      'https://example.com/documents/id_card.png',
      'https://example.com/documents/diploma.pdf'
    ],
    isArray: true
  })
  @Expose()
  @IsOptional()
  @Type(() => Array<string>)
  @IsString({ each: true })
  @Column({
    type: 'json',
    nullable: true
  })
  authorDocuments?: string[];

  @ApiProperty({
    description: 'The country code of the author of the certificate',
    example: 'US',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  authorCountryCode: string;

  @ApiProperty({
    description: 'The level of the certificate granted to the author',
    example: 3,
  })
  @IsNotEmpty()
  @Expose()
  @Column()
  grantLevel: number;

  // Relations
  @OneToOne(() => Certificate, (certificate) => certificate.certificateProfile)
  certificate: Certificate;
}