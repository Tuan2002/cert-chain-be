export interface OrganizationAddedEventJob {
  organizationId: string;
  organizationName: string;
  ownerAddress: string;
  countryCode: string;
  transactionHash: string;
}

export interface MemberAddedEventJob {
  organizationId: string;
  memberAddress: string;
  transactionHash: string;
}