export enum OrganizationMailJobs {
  SEND_REGISTERED_EMAIL = 'send-registered-email',
  SEND_APPROVED_EMAIL = 'send-approved-email',
  SEND_REJECTED_EMAIL = 'send-rejected-email',
  SEND_MANAGER_ADDED_EMAIL = 'send-manager-added-email',
}

export enum OrganizationEventJobs {
  ORGANIZATION_ADDED = 'organization-added',
  MEMBER_ADDED = 'member-added',
}

export enum CertificateTypeEventJobs {
  CERTIFICATE_TYPE_CREATED = 'certificate-type-created',
  CERTIFICATE_TYPE_UPDATED = 'certificate-type-updated',
  CERTIFICATE_TYPE_DEACTIVATED = 'certificate-type-deactivated',
}

export enum CertificateEventJobs {
  CERTIFICATE_SIGNED = 'certificate-signed',
  CERTIFICATE_APPROVED = 'certificate-approved',
  CERTIFICATE_REVOKED = 'certificate-revoked',
}