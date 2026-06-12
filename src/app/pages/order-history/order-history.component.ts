import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { HeaderService } from '../../service/header.service';
import { OrderService } from '../../service/order.service'; 
import { AppAuthService } from '../../service/app.auth.service'; 
import { Order } from '../../dataaccess/order'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../components/base/base.component';
import { OrderTableComponent } from '../../components/order-table/order-table.component';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  imports: [
    CommonModule,
    OrderTableComponent
  ]
})
export class OrderHistoryComponent extends BaseComponent implements OnInit {
  private headerService = inject(HeaderService);
  private orderService = inject(OrderService); 
  private authService = inject(AppAuthService); 
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  public loadedOrders: Order[] = [];
  public isAdmin: boolean = false;

  public constructor() {
    super();
    this.headerService.setPage('nav.order_history');
  }

  ngOnInit() {
    this.checkRoleAndLoadData();
  }

  private checkRoleAndLoadData() {
    this.authService.getRoles().subscribe({
      next: (roles: string[]) => {
        this.isAdmin = roles.some(role => role.toLowerCase() === 'admin'); 
        
        if (this.isAdmin) {
          this.orderService.getList().subscribe({
            next: (orders) => {
              // Sortiert alle Bestellungen absteigend nach ID (neueste zuerst)
              this.loadedOrders = orders.sort((a, b) => b.id - a.id);
              this.cdr.detectChanges(); 
            },
            error: (err) => {
              this.snackBar.open('Fehler beim Laden aller Bestellungen.', 'Schließen', { duration: 4000 });
            }
          });
        } else {
          let username = 'unbekannt';
          const claims = this.authService.getIdentityClaims();
          
          if (claims && claims['preferred_username']) {
            username = claims['preferred_username'];
          }

          if (username === 'unbekannt') {
            this.snackBar.open('Benutzer nicht identifiziert.', 'Schließen', { duration: 4000 });
            return;
          }

          this.orderService.getOrdersByUsername(username).subscribe({
            next: (orders) => {
              // Sortiert die User-Bestellungen ebenfalls absteigend nach ID
              this.loadedOrders = orders.sort((a, b) => b.id - a.id);
              this.cdr.detectChanges(); 
            },
            error: (err) => {
              this.snackBar.open('Fehler beim Laden deines Bestellverlaufs.', 'Schließen', { duration: 4000 });
            }
          });
        }
      },
      error: (err) => {
        this.snackBar.open('Berechtigungen konnten nicht geprüft werden.', 'Schließen', { duration: 4000 });
      }
    });
  }
}