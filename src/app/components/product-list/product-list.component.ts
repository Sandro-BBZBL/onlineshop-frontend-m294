import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HeaderService } from '../../service/header.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Pfad angepasst
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '../base/base.component'; // Pfad angepasst
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-list', // Exakt angepasst
  templateUrl: './product-list.component.html', // Verweist auf dein neues HTML
  styleUrls: ['./product-list.component.scss'], // Verweist auf dein neues SCSS
  imports: [IsInRoleDirective, MatToolbar, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, TranslateModule]
})
export class ProductListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Die Datenstrukturen belassen wir vorerst strukturell identisch, damit es kompiliert.
  // Das Datenmodell für deine Produkte binden wir ein, sobald die Services bereitstehen.
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['name', 'price', 'stock', 'actions']; // Spalten für Kleidung vorbereitet

  public constructor() {
    super();
    // Header-Zuweisung entfernt, das machen jetzt die übergeordneten Pages!
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  async reloadData() {
    // Hier wird später die API-Anbindung für deine Produkte implementiert
  }

  async edit(e: any) {
    // Navigiert später zum Admin-Formular mit der Produkt-ID
    await this.router.navigate(['admin/product-form', e.id]);
  }

  async add() {
    // Navigiert später zum leeren Admin-Formular
    await this.router.navigate(['admin/product-form']);
  }

  delete(e: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        // Löschlogik wird mit dem Produkt-Service verbunden
      }
    });
  }
}