export interface CertificateSignedEventJob {
  certificateId: string;
  certificateTypeId: string;
  organizationId: string;
  authorIdCard: string;
  subnmitterAddress: string;
  transactionHash: string;
}

export interface CertificateApprovedEventJob {
  certificateId: string;
  transactionHash: string;
}

export interface CertificateRevokedEventJob {
  certificateId: string;
  revokedBy: string;
  reason: string;
  transactionHash: string;
}