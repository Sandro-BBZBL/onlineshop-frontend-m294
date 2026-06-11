import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { HeaderService } from '../../service/header.service';
import { OrderService } from '../../service/order.service'; 
import { AppAuthService } from '../../service/app.auth.service'; 
import { Order } from '../../dataaccess/order'; 
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '../../components/base/base.component';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe, DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  imports: [
    CommonModule,
    IsInRoleDirective, 
    MatToolbar, 
    MatButton, 
    MatIcon, 
    MatTable, 
    MatColumnDef, 
    MatHeaderCellDef, 
    MatHeaderCell, 
    MatCellDef, 
    MatCell, 
    MatHeaderRowDef, 
    MatHeaderRow, 
    MatRowDef, 
    MatRow, 
    MatPaginator, 
    DecimalPipe, 
    DatePipe, 
    TranslateModule
  ]
})
export class OrderHistoryComponent extends BaseComponent implements OnInit, AfterViewInit {
  private headerService = inject(HeaderService);
  private orderService = inject(OrderService); 
  private authService = inject(AppAuthService); 
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  columns = ['id', 'orderDate', 'totalPrice'];
  orderDataSource = new MatTableDataSource<Order>();
  
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  public constructor() {
    super();
    this.headerService.setPage('nav.order_history');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.orderDataSource.paginator = this.paginator;
    }
  }

  async reloadData() {
    let username = 'unbekannt';
    
    const claims = this.authService.getIdentityClaims();
    if (claims && claims['preferred_username']) {
      username = claims['preferred_username'];
    }

    if (username === 'unbekannt') {
      this.snackBar.open('Benutzer nicht identifiziert. Verlauf nicht ladbar.', 'Schließen', { duration: 4000 });
      return;
    }

    this.orderService.getOrdersByUsername(username).subscribe({
      next: (orders) => {
        console.log('Backend-Antwort für User "' + username + '":', orders);
        this.orderDataSource.data = orders;
      },
      error: (err) => {
        console.error('Fehler beim Laden des Bestellverlaufs:', err);
        this.snackBar.open('Fehler beim Laden des Bestellverlaufs.', 'Schließen', { duration: 4000 });
      }
    });
  }

  viewDetails(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }
}