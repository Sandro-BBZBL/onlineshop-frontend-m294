import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { Product } from '../../dataaccess/product';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    TranslateModule
  ]
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private router = inject(Router);

  @Input() public products: Product[] = [];
  
  @Output() public productChanged = new EventEmitter<void>();

  public editProduct(id: number): void {
    this.router.navigate(['/admin/product-form', id]);
  }

  public deleteProduct(id: number): void {
    if (confirm('Möchtest du dieses Produkt wirklich löschen?')) {
      
      // HIER KORRIGIERT: Kein "as any" mehr und wir rufen die echte Methode auf
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.productChanged.emit();
        },
        error: (err: any) => {
          console.error('Fehler beim Löschen des Produkts', err);
        }
      });

    }
  }
}