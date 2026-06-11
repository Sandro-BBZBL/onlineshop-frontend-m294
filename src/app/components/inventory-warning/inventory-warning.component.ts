import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../dataaccess/product';

@Component({
  selector: 'app-inventory-warning',
  standalone: true,
  templateUrl: './inventory-warning.component.html',
  styleUrls: ['./inventory-warning.component.scss'],
  imports: [
    CommonModule, 
    MatIconModule, 
    TranslateModule
  ]
})
// HIER NEU: implements OnChanges hinzugefügt
export class InventoryWarningComponent implements OnChanges {
  @Input() public products: Product[] = [];
  
  // HIER NEU: Das ist jetzt eine normale Variable, kein "get" mehr!
  public lowStockProducts: Product[] = [];

  // HIER NEU: Diese Methode wird von Angular automatisch aufgerufen, 
  // sobald das Dashboard neue Produkte aus dem Backend erhält.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      if (!this.products) {
        this.lowStockProducts = [];
      } else {
        // Die Liste wird nur 1x gefiltert, Angular stürzt nicht mehr ab!
        this.lowStockProducts = this.products.filter(p => p.bestand !== undefined && p.bestand < 5);
      }
    }
  }
}