import { AbstractEntity } from "@/base/entities/base.entity";
import { Tables } from "@/enums/tables.enum";
import { Organization } from "@/modules/organization/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { RequestStatus, RequestType } from "../enums";
import { Certificate } from "./certificate.entity";

@Entity(Tables.CertificateRequest)
export class CertificateRequest extends AbstractEntity {
  @ApiProperty({
    description: 'The type of the certificate request',
    example: RequestType.SIGNUP,
  })
  @IsNotEmpty()
  @IsEnum(RequestType)
  @Expose()
  @Column({
    enum: RequestType
  })
  requestType: RequestType;

  @ApiProperty({
    description: 'The status of the certificate request',
    example: RequestStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(RequestStatus)
  @Expose()
  @Column({
    enum: RequestStatus,
    default: RequestStatus.PENDING
  })
  status: RequestStatus;

  @ApiProperty({
    description: 'The time when the certificate request was made',
    example: '2024-06-15T12:34:56Z',
  })
  @IsNotEmpty()
  @Expose()
  @Column()
  requestedTime: Date;

  @ApiProperty({
    description: 'The reason for rejection if the request was denied',
    example: 'Invalid documents provided',
  })
  @Expose()
  @IsString()
  @Column({
    nullable: true
  })
  rejectionReason?: string;

  @ApiProperty({
    description: 'The ID of the organization that signed the certificate',
    example: 'o1a2b3c4-d5e6-7890-ab12-cd34ef56gh78',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  organizationId: string;

  @ApiProperty({
    description: 'The ID of the certificate associated with this request',
    example: 'c1a2b3c4-d5e6-7f89-0a1b-2c3d4e5f6a7b',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  certificateId: string;

  // Relations
  @OneToMany(() => Certificate, (certificate) => certificate.certificateRequests)
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certificate;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.certificateRequests)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}