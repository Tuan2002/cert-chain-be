export const ORGANIZATION_CONTRACT_ABI = [
    // Events
    'event OrganizationCreated(string id, address owner, string name, string countryCode)',
    'event OrganizationUpdated(string id, string name, string countryCode)',
    'event OrganizationDeactivated(string id)',
    'event ManagerAdded(string orgId, address manager)',
    'event ManagerRemoved(string orgId, address manager)',

    // Functions
    'function createOrganization(string memory _id, address _owner, string memory _name, string memory _countryCode)'
];
