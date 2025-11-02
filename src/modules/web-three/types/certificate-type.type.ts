export type CreateCertificateType = {
  id: string;
  code: string;
  name: string;
  description?: string;
};

export type UpdateCertificateType
  = {} & CreateCertificateType;