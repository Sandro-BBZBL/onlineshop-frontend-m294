export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  preis: number;   // Angepasst an Java-Entity
  bestand: number; // Angepasst an Java-Entity
  category?: Category;
  
  // Aliase für Frontend-Kompatibilität (Shop-Ansichten)
  price?: number;
  stock?: number;
}