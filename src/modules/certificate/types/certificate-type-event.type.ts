export type CertificateTypeCreatedEvent = {
  certificateTypeId: string;
  name: string;
  code: string;
  transactionHash: string;
}

export type CertificateTypeUpdatedEvent = CertificateTypeCreatedEvent & {
  description?: string;
}

export type CertificateTypeDeactivatedEvent = {
  certificateTypeId: string;
  transactionHash: string;
}