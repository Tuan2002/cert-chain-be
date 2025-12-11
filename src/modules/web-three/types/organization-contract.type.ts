export type CreateOrganizationType = {
  id: string;
  owner: string;
  name: string;
  countryCode: string;
};

export type AddManagerType = {
  orgId: string;
  walletAddress: string;
};