import { Product } from './product';

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  quantity: number;
  totalPrice: number;
  product: Product;
}