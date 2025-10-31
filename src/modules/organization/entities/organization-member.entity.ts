import { AbstractEntity } from "@/base/entities/base.entity";
import { Tables } from "@/enums/tables.enum";
import { User } from "@/modules/user/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Organization } from "./organization.entity";

@Entity(Tables.OrganizationMember)
export class OrganizationMember extends AbstractEntity {
  @ApiProperty({
    description: 'Wallet address of the organization member',
    example: '0xd48AB4C6fDf56f05E8237885eB040e9670d0feeb',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  walletAddress: string;

  @ApiProperty({
    description: 'Indicates if the member is an owner of the organization',
    example: true,
  })
  @IsNotEmpty()
  @Expose()
  @Column()
  isOwner: boolean;

  @ApiProperty({
    description: 'The ID of the organization the member belongs to',
    example: '3ef45678-abcd-90ab-cdef-1234567890ab',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  organizationId: string;

  @ApiProperty({
    description: 'The ID of the user associated with the organization member',
    example: '5fgh6789-abcd-90ab-cdef-1234567890ab',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  userId: string;

  @ApiProperty({
    description: 'Indicates if the member is currently active in the organization',
    example: true,
  })
  @IsNotEmpty()
  @Expose()
  @Column({
    default: false,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The blockchain transaction hash for adding the member to the organization',
    example: '0xghi789jkl012mno345pqrs678tuv901wxy234zab567cde890fghabc123def456',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  addedTxHash?: string;

  // Relationships
  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}