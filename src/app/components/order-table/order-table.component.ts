import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Order } from '../../dataaccess/order';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './order-table.component.html'
})
export class OrderTableComponent implements AfterViewInit {
  // Nimmt die Daten von außen (der History Page) entgegen
  @Input() set orders(data: Order[]) {
    this.dataSource.data = data;
  }

  // Steuert, ob wir die Spalte "Kunde" (benutzername) anzeigen
  @Input() isAdmin: boolean = false; 

  public dataSource = new MatTableDataSource<Order>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // Bestimmt dynamisch, welche Spalten gezeichnet werden
  get columns(): string[] {
    if (this.isAdmin) {
      return ['id', 'benutzername', 'orderDate', 'totalPrice'];
    }
    return ['id', 'orderDate', 'totalPrice'];
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}