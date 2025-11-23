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