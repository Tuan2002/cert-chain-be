import { Module } from '@nestjs/common';
import { MailService } from './services';
import { CertificateMailService } from './services/certificate-mail.service';
import { OrganizationMailService } from './services/organization-mail.service';

@Module({
  controllers: [],
  providers: [
    MailService,
    OrganizationMailService,
    CertificateMailService
  ],
  exports: [
    OrganizationMailService,
    CertificateMailService
  ],
})
export class MailModule { }