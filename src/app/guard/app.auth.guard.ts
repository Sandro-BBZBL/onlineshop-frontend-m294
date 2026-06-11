import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppAuthService } from '../service/app.auth.service';
import { map, of } from 'rxjs';

export const appCanActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService: AppAuthService = inject(AppAuthService);
  const oauthService: OAuthService = inject(OAuthService);
  const router = inject(Router);

  // 1. Zuerst prüfen, ob überhaupt ein gültiges Login-Token existiert
  if (!oauthService.hasValidAccessToken()) {
    return router.parseUrl('/noaccess');
  }

  // 2. Wir geben den Datenstrom (Observable) direkt zurück. 
  // Angular wartet nun automatisch, bis die Rollen eingetroffen sind!
  return authService.getRoles().pipe(
    map(userRoles => {
      console.log('Guard prüft Berechtigung mit folgenden User-Rollen:', userRoles);
      
      // EIN ADMIN DARF ALLES: Wenn der User die 'admin'-Rolle besitzt, lassen wir ihn immer durch
      if (userRoles.includes('admin')) {
        return true;
      }

      // Rollen abholen, die für diese spezifische Route gefordert sind
      const requiredRoles = route.data['roles'] as Array<string>;

      // Wenn die Route gar keine speziellen Rollen verlangt, darf jeder eingeloggte User rein
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // Prüfen, ob der normale User mindestens eine der geforderten Rollen besitzt
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        console.warn(`Zugriff verweigert! Erwartet wurde eine von: ${requiredRoles}. User hat: ${userRoles}`);
        return router.parseUrl('/noaccess');
      }

      return true;
    })
  );
};

export const appCanActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => appCanActivate(route, state);