import { Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Order } from '../../dataaccess/order';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: 'order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})
export class OrderTableComponent implements AfterViewInit, OnChanges {
  // Nimmt die Bestellungen von jeder beliebigen Page (User oder Admin) entgegen
  @Input({ required: true }) orders: Order[] = [];

  columns = ['id', 'orderDate', 'totalPrice'];
  orderDataSource = new MatTableDataSource<Order>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orders']) {
      this.orderDataSource.data = this.orders;
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.orderDataSource.paginator = this.paginator;
    }
  }
}