export const CERTIFICATE_TYPE_CONTRACT_ABI = [
  // Events
  'event CertificateTypeCreated(string id, string name, string code)',
  // Functions
  'function createCertificateType(string memory _id, string memory _name, string memory _code, string memory _description)',
  'function updateCertificateType(string memory _typeId, string memory _name, string memory _code, string memory _description)'
];