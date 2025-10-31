export type OrganizationAddedEvent = {
  organizationId: string;
  organizationName: string;
  ownerAddress: string;
  countryCode: string;
  transactionHash: string;
}