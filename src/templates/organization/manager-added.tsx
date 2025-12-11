
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from '@react-email/components';
import dayjs from 'dayjs';
import { Footer, Header } from '../components';
import {
  container,
  divider,
  greeting,
  main,
  noteText,
  paragraph,
  section,
  warningText
} from '../styles/common';

const successBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #22c55e',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const successTitle = {
  color: '#166534',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const infoRow = {
  margin: '10px 0',
};

const infoLabel = {
  color: '#666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const infoValue = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'normal',
  margin: '5px 0 0 0',
  fontFamily: 'monospace',
  backgroundColor: '#f8f9fa',
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #e9ecef',
};

interface ManagerAddedEmailProps {
  organizationName: string;
  managerName: string;
  addedAt: Date;
  account: string;
  password: string;
}

export const ManagerAddedEmail = ({
  organizationName,
  managerName,
  addedAt,
  account,
  password,
}: ManagerAddedEmailProps) => {
  const previewText = `You've been added as a manager to ${organizationName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header title="Manager Access Granted" />
          <Section style={section}>
            <Text style={greeting}>
              Hi {managerName},
            </Text>
            <Text style={paragraph}>
              You've been added as a manager to an organization on CertChain!
            </Text>
            <Section style={successBox}>
              <Text style={successTitle}>
                Welcome to the Team!
              </Text>
              <Text style={paragraph}>
                <strong>Organization:</strong> {organizationName}
                <br />
                <strong>Added on:</strong> {dayjs(addedAt).format('MMMM D, YYYY')}
              </Text>
            </Section>
            <Hr style={divider} />
            <Text style={paragraph}>
              <strong>Your Account Credentials</strong>
            </Text>
            <Section style={infoRow}>
              <Text style={infoLabel}>Account / Email:</Text>
              <Text style={infoValue}>{account}</Text>
            </Section>
            <Section style={infoRow}>
              <Text style={infoLabel}>Temporary Password:</Text>
              <Text style={infoValue}>{password}</Text>
            </Section>
            <Text style={warningText}>
              <strong>Important Security Notice:</strong> Please change your password immediately
              after your first login. This temporary password should not be shared with anyone.
            </Text>
            <Hr style={divider} />
            <Text style={paragraph}>
              <strong>As a Manager, you can:</strong>
            </Text>
            <Text style={paragraph}>
              • Manage organization settings
              <br />
              • Issue and revoke certificates
              <br />
              • View organization reports
              <br />
              • Manage certificate templates
            </Text>
            <Text style={noteText}>
              If you have any questions or need assistance, please don't hesitate to reach out
              to your organization owner or our support team!
            </Text>
          </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}