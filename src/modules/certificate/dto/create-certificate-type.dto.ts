import { PickType } from "@nestjs/swagger";
import { CertificateType } from "../entities";

export class CreateCertificateTypeDto extends PickType(CertificateType, [
  'code',
  'name',
  'description'
]) { }