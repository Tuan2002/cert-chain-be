export type CertificateSignedEvent = {
  certificateId: string;
  certificateTypeId: string;
  organizationId: string;
  authorIdCard: string;
  subnmitterAddress: string;
  transactionHash: string;
}

export type CertificateApprovedEvent = {
  certificateId: string;
  transactionHash: string;
}

export type CertificateRevokedEvent = {
  certificateId: string;
  revokedBy: string;
  reason: string;
  transactionHash: string;
}