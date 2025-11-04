import { AbstractEntity } from "@/base/entities/base.entity";
import { Tables } from "@/enums/tables.enum";
import { Certificate } from "@/modules/certificate/entities";
import { CertificateRequest } from "@/modules/certificate/entities/certificate-request.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { OrganizationMember } from "./organization-member.entity";

@Entity(Tables.Organization)
export class Organization extends AbstractEntity {
  @ApiProperty({
    description: 'The name of the organization',
    example: 'Vietnam Community Software',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the organization',
    example: 'A community for software developers in Vietnam',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  description?: string;

  @ApiProperty({
    description: 'The country code of the organization',
    example: 'VN',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  countryCode: string;

  @ApiProperty({
    description: 'The website URL of the organization',
    example: 'https://vcsoft.com',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  website?: string;

  @ApiProperty({
    description: 'Indicates if the organization is currently active',
    example: true,
  })
  @IsNotEmpty()
  @Expose()
  @Column({
    default: false,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The blockchain transaction hash for organization initialization',
    example: '0xabc123def456ghi789jkl012mno345pqrs678tuv901wxy234zab567cde890fgh',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  initTxHash?: string;

  @ApiProperty({
    description: 'The blockchain transaction hash for organization ownership change',
    example: '0xdef456ghi789jkl012mno345pqrs678tuv901wxy234zab567cde890fghabc123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  changeOwnerTxHash?: string;

  // Relationships
  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @OneToMany(() => Certificate, (certificate) => certificate.organization)
  certificates: Certificate[];

  @OneToMany(() => CertificateRequest, (certificateRequest) => certificateRequest.organization)
  certificateRequests: CertificateRequest[];
}