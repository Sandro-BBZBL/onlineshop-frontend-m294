import { Routes } from '@angular/router';
import { appCanActivate } from './guard/app.auth.guard';
import { AppRoles } from '../app.roles';

// Imports Pages
import { ShopComponent } from './pages/shop/shop.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';

export const routes: Routes = [
  // Öffentlicher Shop / Startseite
  { path: '', component: ShopComponent },
  { path: 'shop', component: ShopComponent },

  // FIX: Auf 'shop/product/:id' geändert, damit der Router deinen Link im HTML perfekt matcht!
  { path: 'shop/product/:id', component: ProductDetailComponent, pathMatch: 'full' },

  // Bestellhistorie des Kunden (Einloggen als normaler 'user' erforderlich)
  { 
    path: 'order-history', 
    component: OrderHistoryComponent, 
    canActivate: [appCanActivate], 
    data: { roles: [AppRoles.Read] } // Nutzt 'user'
  },

  // Admin-Dashboard (Zutritt NUR für die Rolle 'admin'!)
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [appCanActivate], 
    data: { roles: [AppRoles.Admin] } // Nutzt 'admin'
  },

  // Admin Produkt-Formular (Neu anlegen - NUR für 'admin')
  { 
    path: 'admin/product-form', 
    component: ProductFormComponent, 
    canActivate: [appCanActivate], 
    pathMatch: 'full', 
    data: { roles: [AppRoles.Admin] } 
  },

  // Admin Produkt-Formular (Bestehendes Produkt bearbeiten - NUR für 'admin')
  { 
    path: 'admin/product-form/:id', 
    component: ProductFormComponent, 
    canActivate: [appCanActivate], 
    pathMatch: 'full', 
    data: { roles: [AppRoles.Admin] } 
  },

  // Keine Berechtigung Seite
  { path: 'noaccess', component: NoAccessComponent },
];