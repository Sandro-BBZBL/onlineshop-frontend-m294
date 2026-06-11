import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../dataaccess/order';
import { AppAuthService } from './app.auth.service'; // Dein echter Auth-Service!

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private authService = inject(AppAuthService); // Jetzt typensicher injiziert!

  public static readonly backendUrl = 'orders';

  public getList(): Observable<Order[]> {
    return this.http.get<Order[]>(environment.backendBaseUrl + OrderService.backendUrl);
  }

  public getOne(id: number): Observable<Order> {
    return this.http.get<Order>(environment.backendBaseUrl + OrderService.backendUrl + `/${id}`);
  }

  public update(order: Order): Observable<Order> {
    return this.http.put<Order>(environment.backendBaseUrl + OrderService.backendUrl + `/${order.id}`, order);
  }

  public save(order: Order): Observable<Order> {
    return this.http.post<Order>(environment.backendBaseUrl + OrderService.backendUrl, order);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + OrderService.backendUrl + `/${id}`, { observe: 'response' });
  }

  /**
   * Direkter Checkout für ein Produkt von der Detailseite.
   */
  public checkoutSingleProduct(productId: number, quantity: number): Observable<any> {
    
    let aktuellerUser = 'unbekannt';
    
    // Wir holen uns die Claims aus dem Keycloak-Token über deinen Service
    const claims = this.authService.getIdentityClaims();
    if (claims && claims['preferred_username']) {
      aktuellerUser = claims['preferred_username']; // Das ist dein echter Keycloak-Login-Name!
    }

    const orderPayload = {
      productId: productId,
      menge: quantity,
      benutzername: aktuellerUser
    };
    
    console.log('Sende echten Payload an POST /api/orders:', orderPayload);
    
    return this.http.post<any>(environment.backendBaseUrl + OrderService.backendUrl, orderPayload);
  }
}