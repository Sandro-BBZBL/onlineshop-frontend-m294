import '@angular/compiler';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router';
import { Product } from '../../dataaccess/product';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

describe('ProductListComponent (Vitest Component Logik-Test)', () => {
  let component: ProductListComponent;
  let mockProductService: any;
  let mockRouter: any;
  let confirmSpy: any;

  beforeEach(() => {
    mockProductService = {
      deleteProduct: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    const mockInjector = {
      get: vi.fn((token) => {
        if (token === ProductService) return mockProductService;
        if (token === Router) return mockRouter;
        return null;
      })
    } as unknown as EnvironmentInjector;

    runInInjectionContext(mockInjector, () => {
      component = new ProductListComponent();
    });

    // Wir speichern uns die gemockte Funktion in einer Variable ab
    confirmSpy = vi.fn(() => true);
    vi.stubGlobal('confirm', confirmSpy);
    
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('sollte die Komponente erfolgreich initialisieren', () => {
    expect(component).toBeTruthy();
    expect(component.products.length).toBe(0);
  });

  it('sollte bei editProduct() zum richtigen Admin-Formular navigieren', () => {
    const productId = 42;
    component.editProduct(productId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/product-form', productId]);
  });

  it('sollte bei deleteProduct() das Produkt löschen und das Event emitten', () => {
    const productId = 10;
    mockProductService.deleteProduct.mockReturnValue(of({}));
    
    let eventEmitted = false;
    component.productChanged.subscribe(() => {
      eventEmitted = true;
    });

    component.deleteProduct(productId);

    // FIX: Wir prüfen den confirmSpy direkt, ohne "window"
    expect(confirmSpy).toHaveBeenCalledWith('Möchtest du dieses Produkt wirklich löschen?');
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(eventEmitted).toBe(true);
  });

  it('sollte den Löschvorgang abbrechen, wenn der User im Confirm auf Abbrechen klickt', () => {
    // Für diesen Test lassen wir den Mock "false" (Abbrechen) zurückgeben
    confirmSpy.mockReturnValue(false);
    const productId = 10;

    component.deleteProduct(productId);

    // FIX: Auch hier nutzen wir den confirmSpy direkt
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockProductService.deleteProduct).not.toHaveBeenCalled();
  });

  it('sollte den Fehler abfangen und loggen, wenn das Löschen im Backend fehlschlägt', () => {
    const productId = 10;
    const mockError = new Error('Datenbankfehler');
    mockProductService.deleteProduct.mockReturnValue(throwError(() => mockError));

    component.deleteProduct(productId);

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(console.error).toHaveBeenCalledWith('Fehler beim Löschen des Produkts', mockError);
  });
});