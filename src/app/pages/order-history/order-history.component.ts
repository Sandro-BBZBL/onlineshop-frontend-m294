import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { HeaderService } from '../../service/header.service';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '../../components/base/base.component';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history', // Exakt angepasst
  templateUrl: './order-history.component.html', // Verweist auf dein neues HTML
  styleUrls: ['./order-history.component.scss'], // Verweist auf dein neues SCSS
  imports: [IsInRoleDirective, MatToolbar, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, DecimalPipe, DatePipe, TranslateModule]
})
export class OrderHistoryComponent extends BaseComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Datenquelle strukturell vorbereitet (any dient als Platzhalter, bis das Order-Interface definiert ist)
  orderDataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // Tabellenspalten für ein sinnvolles Bestellarchiv angepasst
  columns = ['orderDate', 'orderNumber', 'totalPrice', 'status', 'actions'];

  public constructor() {
    super();

    // Setzt den dynamischen Seitentitel in der Navigationsleiste
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
    // Hier wird später der OrderService angebunden, um die Bestellungen zu laden
  }

  async viewDetails(order: any) {
    // Ermöglicht später das Einsehen einer spezifischen Bestellung
  }

  delete(order: any) {
    // Stornierungs- oder Löschlogik über den Confirm-Dialog vorbereitet
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        // Hier folgt später die Backend-Stornierung
      }
    });
  }
}