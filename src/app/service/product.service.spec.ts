import '@angular/compiler';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { ProductService } from './product.service';
import { Product, Category } from '../dataaccess/product';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

describe('ProductService (Pure Unit Test)', () => {
  let service: ProductService;
  let mockHttpClient: any;

  beforeEach(() => {
    // 1. Mock für den HttpClient bauen
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    };

    // 2. Einen minimalen, leeren Angular-Injector simulieren
    const mockInjector = {
      get: vi.fn((token) => {
        // Wenn Angular nach dem HttpClient fragt, geben wir unseren Mock zurück
        return mockHttpClient;
      })
    } as unknown as EnvironmentInjector;

    // 3. Den Service INNERHALB eines künstlichen Injection-Contexts instanziieren
    runInInjectionContext(mockInjector, () => {
      service = new ProductService();
    });
  });

  it('sollte den Service erfolgreich erstellen', () => {
    expect(service).toBeTruthy();
  });

  it('sollte Kategorien laden (getCategories)', () => {
    const mockCategories: Category[] = [{ id: 1, name: 'Elektronik' }];
    mockHttpClient.get.mockReturnValue(of(mockCategories));

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:8081/api/categories');
  });

  it('sollte ein einzelnes Produkt laden (getProductById)', () => {
    const mockProduct: Product = { id: 1, name: 'Laptop', preis: 1000, bestand: 10 };
    mockHttpClient.get.mockReturnValue(of(mockProduct));

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:8081/api/products/1');
  });

  it('sollte ein Produkt erstellen (createProduct)', () => {
    const newProduct = { name: 'Maus', preis: 25, bestand: 100 };
    mockHttpClient.post.mockReturnValue(of({ success: true }));

    service.createProduct(newProduct).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(mockHttpClient.post).toHaveBeenCalledWith('http://localhost:8081/api/products', newProduct);
  });

  it('sollte alle Produkte laden via getProducts()', () => {
    const mockProducts: Product[] = [{ id: 1, name: 'Tastatur', preis: 50, bestand: 20 }];
    mockHttpClient.get.mockReturnValue(of(mockProducts));

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:8081/api/products');
  });

  it('sollte alle Produkte laden via getList()', () => {
    const mockProducts: Product[] = [{ id: 1, name: 'Monitor', preis: 200, bestand: 5 }];
    mockHttpClient.get.mockReturnValue(of(mockProducts));

    service.getList().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:8081/api/products');
  });

  it('sollte ein Produkt löschen (deleteProduct)', () => {
    mockHttpClient.delete.mockReturnValue(of({ deleted: true }));

    service.deleteProduct(99).subscribe(res => {
      expect(res).toEqual({ deleted: true });
    });

    expect(mockHttpClient.delete).toHaveBeenCalledWith('http://localhost:8081/api/products/99');
  });
});