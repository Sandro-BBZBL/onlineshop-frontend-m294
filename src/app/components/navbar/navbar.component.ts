import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { AppAuthService } from '../../service/app.auth.service'; 
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public authService = inject(AppAuthService);
  private cdr = inject(ChangeDetectorRef);

  public isLoggedIn = false;
  public isAdmin = false;

  ngOnInit(): void {
    // Wir hören auf den Login-Stream
    this.authService.accessTokenObservable.subscribe(token => {
      this.isLoggedIn = !!token;

      if (this.isLoggedIn) {
        // Wenn eingeloggt, holen wir die Rollen
        this.authService.getRoles().subscribe({
          next: (roles) => {
            console.log('Navbar hat Rollen erhalten:', roles);
            // Prüft, ob 'admin' im Array existiert
            this.isAdmin = roles.includes('admin');
            
            // Erzwingt, dass Angular das HTML sofort updated
            this.cdr.detectChanges();
          },
          error: () => {
            this.isAdmin = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.isAdmin = false;
        this.cdr.detectChanges();
      }
    });
  }
}