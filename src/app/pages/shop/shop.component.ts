import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../service/product.service';
import { Product } from '../../dataaccess/product';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    NavbarComponent,
    ProductCardComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);

  // Moderne Angular Signals für reaktive Datenhaltung
  public products = signal<Product[]>([]);
  public loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getList().subscribe({
      next: (data: Product[]) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Fehler beim Laden der Produkte:', err);
        this.loading.set(false);
        
        // Bei einem Fehler bleibt die Liste einfach leer
        this.products.set([]);
      }
    });
  }

  public addToCart(product: Product): void {
    // Hier kommt später die Warenkorb-Logik hin
    alert(`${product.name} wurde zum Warenkorb hinzugefügt!`);
  }
}