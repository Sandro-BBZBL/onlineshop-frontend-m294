import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'; // <-- FIX 1: Toolbar Import hinzugefügt
import { TranslateModule } from '@ngx-translate/core';

import { ProductService } from '../../service/product.service';
import { Product } from '../../dataaccess/product';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { InventoryWarningComponent } from '../../components/inventory-warning/inventory-warning.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule, // <-- FIX 1: Toolbar im Array registriert
    TranslateModule,
    ProductListComponent,
    InventoryWarningComponent
  ]
})
export class AdminDashboardComponent implements OnInit {
  public products: Product[] = [];

  private productService = inject(ProductService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadProducts();
  }

  public loadProducts(): void {
    this.productService.getList().subscribe({
      next: (data) => {
        console.log('Backend liefert folgende Produkte:', data);
        this.products = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Fehler beim Laden der Produkte für das Dashboard', err);
      }
    });
  }

  public navigateToCreateProduct(): void {
    this.router.navigate(['/admin/product-form']);
  }

  // FIX 2: Methode hinzugefügt, die nach dem Löschen eines Produkts die Liste neu lädt
  public onProductChanged(): void {
    this.loadProducts();
  }
}