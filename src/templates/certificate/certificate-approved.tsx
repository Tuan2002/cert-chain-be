
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import dayjs from 'dayjs';
import QRCode from 'qrcode';
import { Footer, Header } from '../components';
import {
  buttonContainer,
  container,
  divider,
  greeting,
  main,
  noteText,
  paragraph,
  section,
} from '../styles/common';

const successBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #22c55e',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const successTitle = {
  color: '#166534',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const certificateInfoBox = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const infoRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '12px 0',
  paddingBottom: '12px',
  borderBottom: '1px solid #e9ecef',
};

const infoLabel = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  flex: '1',
};

const infoValue = {
  color: '#333',
  fontSize: '14px',
  margin: '0',
  flex: '2',
  textAlign: 'right' as const,
};

const qrCodeSection = {
  backgroundColor: '#fff',
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const qrCodeTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const qrCodeImage = {
  width: '200px',
  height: '200px',
  margin: '0 auto',
  display: 'block',
};

const viewButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 0',
  margin: '0 auto',
};

const blockchainBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #3b82f6',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
};

const txHashText = {
  color: '#1e40af',
  fontSize: '12px',
  fontFamily: 'monospace',
  wordBreak: 'break-all' as const,
  margin: '5px 0 0 0',
};

const statusBadge = {
  display: 'inline-block',
  backgroundColor: '#dcfce7',
  color: '#166534',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  margin: '10px 0',
};

const highlightBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '4px',
  padding: '15px',
  margin: '20px 0',
};

interface CertificateApprovedEmailProps {
  recipientName: string;
  certificateType: string;
  organizationName: string;
  approvedAt: Date;
  validFrom: Date;
  validTo: Date;
  certificateCode: string;
  approvalTxHash: string;
}

export const CertificateApprovedEmail = ({
  recipientName,
  certificateType,
  organizationName,
  approvedAt,
  validFrom,
  validTo,
  certificateCode,
  approvalTxHash,
}: CertificateApprovedEmailProps) => {
  const previewText = `Your certificate has been approved and issued!`;
  const certificateViewUrl = `${process.env.APP_URL || 'http://localhost:3000'}/certificates/${certificateCode}`;
  const blockExplorerUrl = `${process.env.ETHEREUM_EXPLORER_URL || 'https://etherscan.io'}/tx/${approvalTxHash}`;
  const qrCodeUrl = QRCode.toDataURL(certificateViewUrl);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header title="Certificate Issued Successfully! 🎓" />
          <Section style={section}>
            <Text style={greeting}>
              Hi {recipientName},
            </Text>
            <Text style={paragraph}>
              Congratulations! Your certificate has been successfully approved and issued on the blockchain.
            </Text>
            <Text style={paragraph}>
              <span style={statusBadge}>✓ Approved & Issued</span>
            </Text>

            <Section style={successBox}>
              <Text style={successTitle}>
                Certificate Successfully Issued!
              </Text>
              <Text style={paragraph}>
                Your digital certificate is now permanently recorded on the blockchain
                and ready to share.
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={paragraph}>
              <strong>Certificate Details</strong>
            </Text>
            <Section style={certificateInfoBox}>
              <div style={infoRow}>
                <Text style={infoLabel}>Certificate Type:</Text>
                <Text style={infoValue}>{certificateType}</Text>
              </div>
              <div style={infoRow}>
                <Text style={infoLabel}>Issued By:</Text>
                <Text style={infoValue}>{organizationName}</Text>
              </div>
              <div style={infoRow}>
                <Text style={infoLabel}>Issued On:</Text>
                <Text style={infoValue}>{dayjs(approvedAt).format('MMMM D, YYYY')}</Text>
              </div>
              <div style={infoRow}>
                <Text style={infoLabel}>Valid From:</Text>
                <Text style={infoValue}>{dayjs(validFrom).format('MMMM D, YYYY')}</Text>
              </div>
              <div style={infoRow}>
                <Text style={infoLabel}>Valid Until:</Text>
                <Text style={infoValue}>{dayjs(validTo).format('MMMM D, YYYY')}</Text>
              </div>
            </Section>

            <Section style={qrCodeSection}>
              <Text style={qrCodeTitle}>
                Verification QR Code
              </Text>
              <Text style={paragraph}>
                Scan this QR code to verify your certificate instantly
              </Text>
              <Img
                src={qrCodeUrl}
                alt="Certificate QR Code"
                style={qrCodeImage}
              />
            </Section>

            <Section style={buttonContainer}>
              <Button href={certificateViewUrl} style={viewButton}>
                View Certificate
              </Button>
            </Section>

            <Hr style={divider} />

            <Section style={blockchainBox}>
              <Text style={paragraph}>
                <strong>Blockchain Verification</strong>
              </Text>
              <Text style={paragraph}>
                Your certificate is secured on the blockchain. Transaction Hash:
              </Text>
              <Text style={txHashText}>
                {approvalTxHash}
              </Text>
              <Text style={noteText}>
                <Link href={blockExplorerUrl} style={{ color: '#3b82f6' }}>
                  View on Block Explorer →
                </Link>
              </Text>
            </Section>

            <Section style={highlightBox}>
              <Text style={paragraph}>
                <strong>📱 What you can do next:</strong>
              </Text>
              <Text style={paragraph}>
                • Download your certificate in PDF format
                <br />
                • Share your certificate on social media
                <br />
                • Add the certificate to your professional profiles
                <br />
                • Use the QR code for quick verification
                <br />
                • View the blockchain transaction for proof of authenticity
              </Text>
            </Section>

            <Text style={noteText}>
              This certificate is permanently stored on the blockchain and can be verified
              at any time. If you have any questions or need assistance, please contact the
              issuing organization or our support team.
            </Text>
          </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
};