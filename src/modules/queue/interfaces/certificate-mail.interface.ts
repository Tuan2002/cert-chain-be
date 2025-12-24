export interface SendCertificateApprovedJob {
  to: string;
  organizationName: string;
  recipientName: string;
  certificateType: string;
  approvedAt: Date;
  validFrom: Date;
  validTo: Date;
  certificateCode: string;
  approvalTxHash: string;
}