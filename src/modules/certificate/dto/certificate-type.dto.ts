import { PickType } from "@nestjs/swagger";
import { CertificateType } from "../entities";

export class CertificateTypeDto extends PickType(CertificateType, [
  'id',
  'code',
  'name',
  'description',
  "additionalInfo",
  'isActive',
  'initTxHash',
  'lastChangedTxHash',
  'createdAt',
  'updatedAt'
]) { }