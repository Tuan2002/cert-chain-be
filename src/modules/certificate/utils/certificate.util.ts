import randomstring from 'randomstring';
import { CertificateHashType } from '../types';

export const generateCertCode = (prefix?: string): string => {
  const randomCode = randomstring.generate({
    length: 12,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  });
  return prefix ? `${prefix}${randomCode}` : randomCode;
}

export const generateCertBuffer = async (
  certificateData: CertificateHashType,
): Promise<Buffer> => {
  const jsonContent = JSON.stringify(certificateData);
  return Buffer.from(jsonContent, 'utf-8');
};
