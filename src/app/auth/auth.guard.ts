
import { inject } from '@angular/core';
import{
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  CanActivateFn
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { PermissionService } from '../services/permission.service';
import { APPLICATION_ID, REALM_MANAGEMENT_ID } from '../constants';

function checkRoleAndPermission(
  routeRoles: string[],
  routePermissions: string[],
  grantedRoles: any
): boolean {
  const permissionService = inject(PermissionService);

  const grantedClientRole = permissionService.hasRoleAccess(
    routeRoles || [],
    grantedRoles?.realmRoles || []
  );

  const userPortalRoles = grantedRoles?.resourceRoles?.[APPLICATION_ID] || [];
  const realmManagementRoles =
    grantedRoles?.resourceRoles?.[REALM_MANAGEMENT_ID] || [];

  const grantedPermissions = permissionService.hasPermissionAccess(
    routePermissions || [],
    [...userPortalRoles, ...realmManagementRoles]
  );

  return grantedClientRole && grantedPermissions;
}

const isAccessAllowed=async(
  route:ActivatedRouteSnapshot,
  _:RouterStateSnapshot,
  authData:AuthGuardData
):Promise<boolean | UrlTree>=>{
  const{authenticated,grantedRoles}=authData;
  const router=inject(Router);

  const requiredRoles=route.data['role'];
  console.log(requiredRoles);
  console.log(grantedRoles);
  console.log(authenticated);

  const requiredPermissions=route.data['permissions'];
  console.log(requiredPermissions);

  // If no role or permission is required, allow access
  if (!requiredRoles && !requiredPermissions) {
    console.log('no roles or permissions required, allowing access');
    return true;
  }

  // If not authenticated, redirect to login
  if (!authenticated) {
    console.log('user not authenticated, redirecting to login');
    return router.parseUrl('/login');
  }

  // Check if user has required roles and permissions
  if (checkRoleAndPermission(requiredRoles, requiredPermissions, grantedRoles)) {
    console.log('access allowed');
    return true;
  }

  // Authenticated but lacks required roles/permissions
  console.log('access denied - insufficient permissions');
  return router.parseUrl('/');

  // //Checking realm roles
  // const hasRealmRole=grantedRoles.realmRoles.includes(requiredRoles);

  // //checking client roles
  // const hasClientRole=Object.values(grantedRoles.resourceRoles).some((roles)=>
  //   roles.includes(requiredRoles)
  // );

  // if (authenticated && (hasRealmRole || hasClientRole)){
  //   return true;
  // }

  // return router.parseUrl('')
};

export const canActivateAuthRole=
  createAuthGuard<CanActivateFn>(isAccessAllowed)

