import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { APPLICATION_ID, REALM_MNG_ID } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private readonly _keycloak: Keycloak) {}

  hasRoleAccess(roleName: string[], grantedRoles: string[]): boolean {
    // If no roles are required, allow access
    if (!roleName || roleName.length === 0) {
      return true;
    }
    return roleName.some((role) => grantedRoles.includes(role));
  }

  hasPermissionAccess(
    permissions: string[],
    grantedPermissions: string[]
  ): boolean {
    // If no permissions are required, allow access
    if (!permissions || permissions.length === 0) {
      return true;
    }
    return permissions.some((p) => grantedPermissions.includes(p));
  }

  hasPermission(permission: string): boolean {
    const userPortalRoles =
      this._keycloak.resourceAccess?.[APPLICATION_ID]?.roles || [];
    const realmManagementRoles =
      this._keycloak.resourceAccess?.[REALM_MNG_ID]?.roles || [];
    return [...userPortalRoles, ...realmManagementRoles].includes(permission);
  }
}
