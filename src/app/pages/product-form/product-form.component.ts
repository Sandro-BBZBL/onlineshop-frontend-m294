import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../service/header.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../components/base/base.component';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service'; 
import { Category } from '../../dataaccess/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  imports: [CommonModule, MatToolbar, MatToolbarRow, MatButton, MatIcon, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, AutofocusDirective, MatHint, MatSelect, MatOption, TranslateModule]
})
export class ProductFormComponent extends BaseComponent implements OnInit {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private productService = inject(ProductService); 

  public categories: Category[] = [];
  private productId: number | null = null;

  public objForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    price: new UntypedFormControl('', [Validators.required, Validators.min(0.05)]),
    stock: new UntypedFormControl('', [Validators.required, Validators.min(0)]),
    categoryId: new UntypedFormControl('', [Validators.required])
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    // 1. Kategorien laden
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Fehler beim Laden der Kategorien:', err)
    });

    // 2. Bearbeiten-Modus prüfen (Mappt die deutschen Backend-Felder ins Formular)
    if (this.route.snapshot.paramMap.get('id') !== null) {
      this.productId = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.headerService.setPage('nav.product_edit');
      
      this.productService.getProductById(this.productId).subscribe(prod => {
        this.objForm.patchValue({
          name: prod.name,
          price: (prod as any).preis,
          stock: (prod as any).bestand,
          categoryId: prod.category?.id
        });
      });
    } else {
      this.headerService.setPage('nav.product_new');
    }
  }

  async back() {
    await this.router.navigate(['admin/dashboard']);
  }

  async save(formData: any) {
    if (this.objForm.invalid) return;

    const selectedCategory = this.categories.find(c => c.id === Number(this.objForm.value.categoryId));

    // Exaktes Mapping an dein Java-Entity 'Product.java'
    const targetProduct: any = {
      name: this.objForm.value.name,
      preis: Number(this.objForm.value.price),
      bestand: Number(this.objForm.value.stock),
      category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null
    };

    if (this.productId !== null) {
      targetProduct.id = this.productId;
    }

    this.productService.createProduct(targetProduct).subscribe({
      next: () => {
        this.snackBar.open('Produkt erfolgreich gespeichert!', 'Schliessen', { duration: 5000 });
        this.back();
      },
      error: (err) => {
        console.error('Fehler beim Speichern:', err);
        this.snackBar.open('Fehler beim Speichern aufgetreten!', 'Schliessen', { duration: 5000 });
      }
    });
  }
}