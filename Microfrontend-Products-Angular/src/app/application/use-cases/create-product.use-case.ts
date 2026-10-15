import { inject, Injectable } from '@angular/core';
import { CreateProductInput, ProductCategory } from '../../domain/product.model';
import { PRODUCTS_REPOSITORY } from '../ports/products.repository';

@Injectable({ providedIn: 'root' })
export class CreateProductUseCase {
  private readonly products = inject(PRODUCTS_REPOSITORY);
  private readonly validCategories: ProductCategory[] = ['Carnes', 'Frutas', 'Lacteos', 'Verduras'];

  execute(input: CreateProductInput) {
    if (!input.name.trim()) {
      throw new RangeError('El nombre del producto es obligatorio.');
    }
    if (!this.validCategories.includes(input.category)) {
      throw new RangeError('La categoría seleccionada no es válida.');
    }
    if (!Number.isFinite(input.price) || input.price <= 0) {
      throw new RangeError('El precio debe ser un número positivo.');
    }
    return this.products.create({
      ...input,
      name: input.name.trim(),
    });
  }
}

