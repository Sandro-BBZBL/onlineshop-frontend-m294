import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Product } from '../../dataaccess/product';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [
    CommonModule,
    MatToolbar,
    MatToolbarRow,
    MatButton,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    AutofocusDirective,
    MatHint,
    TranslateModule
  ]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private formBuilder = inject(UntypedFormBuilder);
  private snackBar = inject(MatSnackBar);

  public product: Product | null = null;
  public objForm!: UntypedFormGroup;

  ngOnInit(): void {
    const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);

    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product = prod;

        // Formular initialisieren und an 'prod.bestand' anpassen
        this.objForm = this.formBuilder.group({
          quantity: [1, [
            Validators.required, 
            Validators.min(1), 
            Validators.max(prod.bestand || 0) // FIX: Nutzt jetzt 'bestand' statt 'stock'
          ]]
        });
      },
      error: (err) => {
        console.error('Fehler beim Laden des Produkts:', err);
        this.snackBar.open('Produktdetails konnten nicht geladen werden.', 'Schliessen', { duration: 5000 });
      }
    });
  }

  back(): void {
    this.router.navigate(['/shop']);
  }

  orderProduct(): void {
    if (this.objForm.invalid || !this.product) return;

    const orderPayload = {
      productId: this.product.id,
      quantity: this.objForm.value.quantity
    };

    console.log('Bestellung wird abgeschickt:', orderPayload);
    this.snackBar.open('Produkt erfolgreich bestellt! (Simulation)', 'Schliessen', { duration: 3000 });
    this.router.navigate(['/shop']);
  }
}