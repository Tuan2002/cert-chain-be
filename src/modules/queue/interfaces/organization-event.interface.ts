export interface OrganizationAddedEventJob {
  organizationId: string;
  organizationName: string;
  ownerAddress: string;
  countryCode: string;
  transactionHash: string;
}