import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthConfig, OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {
  private oauthService = inject(OAuthService);
  private authConfig = inject(AuthConfig);

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private usernameSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly usernameObservable: Observable<string> = this.usernameSubject.asObservable();
  private useraliasSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly useraliasObservable: Observable<string> = this.useraliasSubject.asObservable();
  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly accessTokenObservable: Observable<string> = this.accessTokenSubject.asObservable();

  constructor() {
    this.handleEvents(null);
  }

  private _decodedAccessToken: any;

  get decodedAccessToken() {
    return this._decodedAccessToken;
  }

  private _accessToken = '';

  get accessToken() {
    return this._accessToken;
  }

  async initAuth(): Promise<any> {
    return new Promise<void>(() => {
      this.oauthService.configure(this.authConfig);
      this.oauthService.events
        .subscribe(e => this.handleEvents(e));
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.oauthService.setupAutomaticSilentRefresh();
    });
  }

  /**
   * Liest die Rollen aus dem JWT Token für die echte ID 'onlineshop-client' aus.
   */
  public getRoles(): Observable<Array<string>> {
    if (this._decodedAccessToken !== null && this._decodedAccessToken !== undefined) {
      return new Observable<Array<string>>(observer => {
        // Greift direkt und sicher auf deine echte Projekt-ID 'onlineshop-client' zu
        const clientAccess = this._decodedAccessToken?.resource_access?.['onlineshop-client'];
        
        if (clientAccess && clientAccess.roles) {
          if (Array.isArray(clientAccess.roles)) {
            const resultArr = clientAccess.roles.map((r: string) => r.replace('ROLE_', ''));
            observer.next(resultArr);
          } else {
            observer.next([clientAccess.roles.replace('ROLE_', '')]);
          }
        } else {
          // Sicherer Fallback: Falls Rollen global im Realm definiert sind
          const realmRoles = this._decodedAccessToken?.realm_access?.roles;
          if (realmRoles && Array.isArray(realmRoles)) {
            const resultArr = realmRoles.map((r: string) => r.replace('ROLE_', ''));
            observer.next(resultArr);
          } else {
            observer.next([]);
          }
        }
        observer.complete();
      });
    }
    return of([]);
  }

  public getIdentityClaims(): Record<string, any> {
    return this.oauthService.getIdentityClaims();
  }

  public logout() {
    this.oauthService.logOut();
    this.useraliasSubject.next('');
    this.usernameSubject.next('');
    this.accessTokenSubject.next('');
    this._accessToken = '';
    this._decodedAccessToken = null;
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  private handleEvents(event: any) {
    if (event instanceof OAuthErrorEvent) {
      console.error(event);
    } else {
      this._accessToken = this.oauthService.getAccessToken();
      this.accessTokenSubject.next(this._accessToken);
      this._decodedAccessToken = this.jwtHelper.decodeToken(this._accessToken);

      if (this._decodedAccessToken?.family_name && this._decodedAccessToken?.given_name) {
        const username = this._decodedAccessToken?.given_name + ' ' + this._decodedAccessToken?.family_name;
        this.usernameSubject.next(username);
      }

      const claims = this.getIdentityClaims();
      if (claims !== null) {
        if (claims['preferred_username'] !== '') {
          this.useraliasSubject.next(claims['preferred_username']);
        }
      }
    }
  }
}