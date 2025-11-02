export const CERTIFICATE_TYPE_CONTRACT_ABI = [
  // Events
  'event CertificateTypeCreated(string id, string name, string code)',
  'event CertificateTypeUpdated(string id, string name, string code, string description)',
  'event CertificateTypeDeactivated(string id)',

  // Functions
  'function createCertificateType(string memory _id, string memory _name, string memory _code, string memory _description)',
  'function updateCertificateType(string memory _typeId, string memory _name, string memory _code, string memory _description)',
  'function deactivateCertificateType(string memory _typeId)',
  'function reactivateCertificateType(string memory _typeId)'
];