export type CertificateHashType = {
  certificateCode: string;
  certificateType?: string;
  organizationName?: string;
  validFrom: Date;
  validTo: Date;
  authorProfile: CertificateProfileHash;
};

export type CertificateProfileHash = {
  authorName: string;
  authorIdCard: string;
  authorDob: Date;
  authorEmail: string;
  authorImage: string;
  authorCountryCode: string;
  grantLevel: number;
};