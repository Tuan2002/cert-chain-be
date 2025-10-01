import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import {
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
export abstract class AbstractEntity {
  @ObjectIdColumn({
    select: false,
  })
  @Exclude()
  @IsMongoId()
  _id: ObjectId;

  @PrimaryColumn()
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ type: 'timestamptz' })
  @Expose()
  deletedAt: Date;

  @BeforeInsert()
  generateUniqueId() {
    this.id = uuid();
  }
}
