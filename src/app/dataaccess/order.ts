import { Product } from './product';

export interface Order {
  id: number;
  orderDate: string;   // Datum der Bestellung als String (ISO-Format)
  status: string;      // z.B. 'PENDING', 'SHIPPED', 'DELIVERED'
  quantity: number;    // Bestellte Menge
  totalPrice: number;
  product: Product;    // Das dazugehörige Kleidungsstück
}