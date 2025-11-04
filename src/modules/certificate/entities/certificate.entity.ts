import { AbstractEntity } from "@/base/entities/base.entity";
import { Tables } from "@/enums/tables.enum";
import { Organization } from "@/modules/organization/entities";
import { User } from "@/modules/user/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CertificateStatus } from "../enums/certificate-status.enum";
import { CertificateProfile } from "./certificate-profile.entity";
import { CertificateRequest } from "./certificate-request.entity";
import { CertificateType } from "./certificate-type.entity";

@Entity(Tables.Certificate)
export class Certificate extends AbstractEntity {
  @ApiProperty({
    description: 'The unique code of the certificate',
    example: 'ELG20230001',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    unique: true
  })
  code: string;

  @ApiProperty({
    description: 'The hash of the certificate info stored on ipfs',
    example: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  certificateHash?: string;

  @ApiProperty({
    description: 'The current status of the certificate',
    enum: CertificateStatus,
    example: CertificateStatus.CREATED,
  })
  @IsNotEmpty()
  @IsEnum(CertificateStatus)
  @Expose()
  @Column({
    enum: CertificateStatus,
    default: CertificateStatus.CREATED
  })
  status: CertificateStatus;

  @ApiProperty({
    description: 'The date and time from which the certificate is valid',
    example: '2024-01-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  @Expose()
  @Column()
  validFrom: Date;

  @ApiProperty({
    description: 'The date and time until which the certificate is valid',
    example: '2025-01-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  @Expose()
  @Column()
  validTo: Date;

  @ApiProperty({
    description: 'The ID of the certificate type associated with this certificate',
    example: 'c1a2b3d4-e5f6-7890-ab12-cd34ef56gh78',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  certificateTypeId: string;

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
    description: 'The ID of the certificate profile associated with this certificate',
    example: 'p1a2b3c4-d5e6-7890-ab12-cd34ef56gh78',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  certificateProfileId: string;

  @ApiProperty({
    description: 'The ID of the issuer who issued the certificate',
    example: 'i1a2b3c4-d5e6-7890-ab12-cd34ef56gh78',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  issuerId: string;

  @ApiProperty({
    description: 'The date and time when the certificate was approved',
    example: '2023-01-01T00:00:00Z',
  })
  @IsNotEmpty()
  @Expose()
  @Column({
    nullable: true
  })
  approvedAt?: Date;

  @ApiProperty({
    description: 'The date and time when the certificate was revoked',
    example: '2024-01-01T00:00:00Z',
  })
  @IsNotEmpty()
  @Expose()
  @Column({
    nullable: true
  })
  revokedAt?: Date;

  @ApiProperty({
    description: 'The transaction hash of the signed certificate on the blockchain',
    example: '0xabc123def456ghi789jkl012mno345pqrs678tuv901wxy234z567890abcd1234',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  signedTxHash?: string;

  @ApiProperty({
    description: 'The transaction hash of the approved certificate on the blockchain',
    example: '0xdef456ghi789jkl012mno345pqrs678tuv901wxy234z567890abcd1234abc123',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  approvedTxHash?: string;

  @ApiProperty({
    description: 'The transaction hash of the revoked certificate on the blockchain',
    example: '0xghi789jkl012mno345pqrs678tuv901wxy234z567890abcd1234abc123def456'
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  revokedTxHash?: string;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.certificates)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => CertificateType, (certificateType) => certificateType.certificates)
  @JoinColumn({ name: 'certificate_type_id' })
  certificateType: CertificateType;

  @ManyToOne(() => CertificateRequest, (certificateRequest) => certificateRequest.certificate)
  certificateRequests: CertificateRequest[];

  @ManyToOne(() => User, (user) => user.issuedCertificates)
  @JoinColumn({ name: 'issuer_id' })
  issuer: User;

  @OneToOne(() => CertificateProfile, (certificateProfile) => certificateProfile.certificate)
  @JoinColumn({ name: 'certificate_profile_id' })
  certificateProfile: CertificateProfile;
}