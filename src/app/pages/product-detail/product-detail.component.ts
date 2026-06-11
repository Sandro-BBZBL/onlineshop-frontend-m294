import { Component, OnInit, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { OrderService } from '../../service/order.service'; // 1. OrderService importieren
import { Product } from '../../dataaccess/product';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [
    CommonModule,
    MatButton,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    AutofocusDirective,
    MatHint,
    TranslateModule,
    ProductCardComponent
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private orderService = inject(OrderService); // 2. OrderService injizieren
  private formBuilder = inject(UntypedFormBuilder);
  private snackBar = inject(MatSnackBar);

  public product = signal<Product | null>(null);
  public objForm!: UntypedFormGroup;
  private routeSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) return;

      const id = Number.parseInt(idParam, 10);
      if (Number.isNaN(id)) return;

      this.productService.getProductById(id).subscribe({
        next: (prod) => {
          this.product.set(prod);

          this.objForm = this.formBuilder.group({
            quantity: [1, [
              Validators.required, 
              Validators.min(1), 
              Validators.max(prod.bestand || 0)
            ]]
          });
        },
        error: (err) => {
          console.error('Fehler beim Laden des Produkts:', err);
          this.snackBar.open('Produktdetails konnten nicht geladen werden.', 'Schliessen', { duration: 5000 });
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  back(): void {
    this.router.navigate(['/shop']);
  }

  orderProduct(): void {
    const currentProduct = this.product();
    if (this.objForm.invalid || !currentProduct) return;

    const quantity = this.objForm.value.quantity;

    // 3. Echte Backend-Bestellung abschicken
    this.orderService.checkoutSingleProduct(currentProduct.id, quantity).subscribe({
      next: (response) => {
        console.log('Bestellung erfolgreich im Backend verbucht:', response);
        this.snackBar.open('Bestellung erfolgreich abgeschickt!', 'Schliessen', { duration: 3000 });
        
        // Nach erfolgreichem Kauf direkt in den Bestellverlauf (History) springen!
        this.router.navigate(['/order-history']);
      },
      error: (err) => {
        console.error('Fehler beim Bestellen des Produkts:', err);
        this.snackBar.open('Bestellung fehlgeschlagen. Bitte versuche es erneut.', 'Schliessen', { duration: 4000 });
      }
    });
  }
}