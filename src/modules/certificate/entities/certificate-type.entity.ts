import { AbstractEntity } from "@/base/entities/base.entity";
import { Tables } from "@/enums/tables.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column, Entity } from "typeorm";

@Entity(Tables.CertificateType)
export class CertificateType extends AbstractEntity {
  @ApiProperty({
    description: 'The unique code of the certificate type',
    example: 'ENG_01',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column({
    unique: true
  })
  code: string;

  @ApiProperty({
    description: 'The name of the certificate type',
    example: 'English Proficiency Certificate',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the certificate type',
    example: 'This certificate verifies the English proficiency level of an individual.',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({
    nullable: true
  })
  description?: string;

  @ApiProperty({
    description: 'Indicates if the certificate type is currently active',
    example: true,
  })
  @IsNotEmpty()
  @Expose()
  @Column({
    default: false
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The transaction hash of the certificate type initialization on the blockchain',
    example: '0xabc123def456ghi789jkl012mno345pqrs678tuv901wxy234zab567cde890fgh',
  })
  @IsOptional()
  @IsString()
  @Expose()
  @Column({
    nullable: true,
  })
  initTxHash: string;
}