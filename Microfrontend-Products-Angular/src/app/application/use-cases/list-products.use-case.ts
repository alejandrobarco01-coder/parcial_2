import { inject, Injectable } from '@angular/core';
import { PRODUCTS_REPOSITORY } from '../ports/products.repository';

@Injectable({ providedIn: 'root' })
export class ListProductsUseCase {
  private readonly products = inject(PRODUCTS_REPOSITORY);

  execute(limit = 10) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('El límite debe ser un entero entre 1 y 100.');
    }
    return this.products.findAll(limit);
  }
}

