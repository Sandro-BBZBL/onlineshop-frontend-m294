import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../dataaccess/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  // Der Endpoint für dein Backend lautet nun 'order' (Bestellungen)
  public static readonly backendUrl = 'order';

  /**
   * Holt die gesamte Bestellhistorie (GET)
   */
  public getList(): Observable<Order[]> {
    return this.http.get<Order[]>(environment.backendBaseUrl + OrderService.backendUrl);
  }

  /**
   * Holt eine einzelne Bestellung anhand der ID (GET)
   */
  public getOne(id: number): Observable<Order> {
    return this.http.get<Order>(environment.backendBaseUrl + OrderService.backendUrl + `/${id}`);
  }

  /**
   * Aktualisiert eine bestehende Bestellung (PUT)
   */
  public update(order: Order): Observable<Order> {
    return this.http.put<Order>(environment.backendBaseUrl + OrderService.backendUrl + `/${order.id}`, order);
  }

  /**
   * Standard-Speichermethode für ein einzelnes Order-Objekt (POST)
   */
  public save(order: Order): Observable<Order> {
    return this.http.post<Order>(environment.backendBaseUrl + OrderService.backendUrl, order);
  }

  /**
   * Löscht eine Bestellung (DELETE)
   */
  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + OrderService.backendUrl + `/${id}`, { observe: 'response' });
  }

  /**
   * WICHTIGE LOGIK-REGEL 4: Direkter Checkout für ein Produkt von der Detailseite.
   * Schickt NUR ein Array mit productId und quantity, da das Backend den Rest 
   * (Username, Datum, Gesamtpreis) selbst berechnet und absichert.
   */
  public checkoutSingleProduct(productId: number, quantity: number): Observable<any> {
    const orderPayload = [
      {
        productId: productId,
        quantity: quantity
      }
    ];
    return this.http.post<any>(environment.backendBaseUrl + OrderService.backendUrl, orderPayload);
  }
}