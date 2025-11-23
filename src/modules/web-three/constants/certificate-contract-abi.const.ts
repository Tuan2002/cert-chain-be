export const CERTIFICATE_CONTRACT_ABI = [
  // Events
  'event CertificateSubmitted(string id, string organizationId, string certificateTypeId, address submittedBy, string holderIdCard)',
  'event CertificateApproved(string id, address approvedBy)',
  'event CertificateRejected(string id, address rejectedBy, string reason)',
  'event CertificateRevoked(string id, address revokedBy, string reason)',
  'event CertificateRemoved(string id, address removedBy)',

  // Functions
  'function approveCertificate(string memory _certId)',
  'function rejectCertificate(string memory _certId, string memory _reason)',
  'function revokeCertificate(string memory _certId, string memory _reason)',
];