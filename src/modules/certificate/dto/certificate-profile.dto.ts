import { PickType } from "@nestjs/swagger";
import { CertificateProfile } from "../entities";

export class CertificateProfileDto extends PickType(CertificateProfile, [
  'authorName',
  'authorIdCard',
  'authorDob',
  'authorEmail',
  'authorImage',
  'authorDocuments',
  'authorCountryCode',
  'grantLevel'
]) { }