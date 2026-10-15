export type ProductCategory = 'Lacteos' | 'Carnes' | 'Frutas' | 'Verduras';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
}

export type CreateProductInput = Omit<Product, 'id'>;

