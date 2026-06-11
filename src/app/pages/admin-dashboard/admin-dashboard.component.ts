import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '../../service/header.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '../../components/base/base.component';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard', // Exakt angepasst
  standalone: true,
  templateUrl: './admin-dashboard.component.html', // Verweist auf dein neues HTML
  styleUrls: ['./admin-dashboard.component.scss'], // Verweist auf dein neues SCSS
  imports: [CommonModule, IsInRoleDirective, MatToolbar, MatButton, MatIcon, TranslateModule]
})
export class AdminDashboardComponent extends BaseComponent implements OnInit {
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public constructor() {
    const translate = inject(TranslateService);

    super();
    this.translate = translate;

    // Setzt den dynamischen Titel in der Navbar für das Admin-Panel
    this.headerService.setPage('nav.admin_dashboard');
  }

  async ngOnInit() {
    // Hier laden wir später die Statistiken oder Logik für das Admin-Dashboard
  }
}