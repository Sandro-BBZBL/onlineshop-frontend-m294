import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-warning',
  standalone: true,
  templateUrl: './inventory-warning.component.html',
  styleUrls: ['./inventory-warning.component.scss'],
  imports: [CommonModule] // Kein TranslateModule mehr!
})
export class InventoryWarningComponent implements OnInit {
  
  // Liste für Produkte, die fast ausverkauft sind (Später für das Admin-Dashboard)
  public lowStockProducts: any[] = []; 

  ngOnInit(): void {
    // Hier laden wir später die Produkte mit stock < 5
  }
}