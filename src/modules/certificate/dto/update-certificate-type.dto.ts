import { PickType } from "@nestjs/swagger";
import { CertificateType } from "../entities";

export class UpdateCertificateTypeDto extends PickType(CertificateType, [
  'code',
  'name',
  'description'
]) { }