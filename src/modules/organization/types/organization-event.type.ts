export type OrganizationAddedEvent = {
  organizationId: string;
  organizationName: string;
  ownerAddress: string;
  countryCode: string;
  transactionHash: string;
}

export type MemberAddedEvent = {
  organizationId: string;
  memberAddress: string;
  transactionHash: string;
}