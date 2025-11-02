export interface CertificateTypeCreatedEventJob {
  certificateTypeId: string;
  name: string;
  code: string;
  transactionHash: string;
}

export interface CertificateTypeUpdatedEventJob
  extends CertificateTypeCreatedEventJob {
  description?: string;
}

export interface CertificateTypeDeactivatedEventJob {
  certificateTypeId: string;
  transactionHash: string;
}