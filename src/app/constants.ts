export const clientRoles = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
};

// Keycloak Resource/Client IDs for role and permission checking
// APPLICATION_ID: The client ID for your frontend application (matches environment.clientId)
export const APPLICATION_ID = 'frontend-client';

// REALM_MNG_ID: Standard Keycloak client for realm management
export const REALM_MNG_ID = 'realm-management';

// REALM_MANAGEMENT_ID: Alias for realm-management (used in auth guard)
export const REALM_MANAGEMENT_ID = 'realm-management';
