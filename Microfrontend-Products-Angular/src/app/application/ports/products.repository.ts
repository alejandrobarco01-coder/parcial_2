import { InjectionToken } from '@angular/core';
import { CreateProductInput, Product } from '../../domain/product.model';

/** Puerto de salida para consultar y registrar productos. */
export interface ProductsRepository {
  findAll(limit: number): Promise<Product[]>;
  findById(id: number): Promise<Product>;
  create(input: CreateProductInput): Promise<Product>;
}

export const PRODUCTS_REPOSITORY = new InjectionToken<ProductsRepository>('PRODUCTS_REPOSITORY');

