import { CertificateApprovedEmail } from "@/templates/certificate";
import { Injectable, Logger } from "@nestjs/common";
import QRCode from "qrcode";
import { SendCertificateApprovedMailDto } from "../dto";
import { MailService } from "./mail.service";

@Injectable()
export class CertificateMailService {
  private readonly logger = new Logger(CertificateMailService.name);
  constructor(
    private readonly mailService: MailService,
  ) { }

  /**   
   * Send certificate approved email
   * @param sendCertificateData Data transfer object containing email details
   * @returns A promise that resolves when the email is sent
   */
  async sendCertificateApprovedAsync(sendCertificateData: SendCertificateApprovedMailDto): Promise<void> {
    const {
      to,
      certificateType,
      organizationName,
      recipientName,
      approvedAt,
      validFrom,
      validTo,
      certificateCode,
      approvalTxHash,
    } = sendCertificateData;
    const subject = 'CertChain - Certificate Approved';
    const qrCodeUrl = await QRCode.toDataURL(`${process.env.APP_URL}/certificates/${certificateCode}`);

    const body = CertificateApprovedEmail({
      organizationName,
      certificateType,
      recipientName,
      approvedAt,
      validFrom,
      validTo,
      certificateCode,
      qrCodeUrl,
      approvalTxHash,
    });

    return this.mailService.sendReactMail({
      to,
      subject,
      body,
    }).catch((error) => {
      this.logger.error(`Failed to send certificate approved email to ${to}: ${error.message}`);
      throw new Error(`Error sending certificate approved email: ${error.message}`);
    });
  }
}