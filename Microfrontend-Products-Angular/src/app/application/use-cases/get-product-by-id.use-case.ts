import { inject, Injectable } from '@angular/core';
import { PRODUCTS_REPOSITORY } from '../ports/products.repository';

@Injectable({ providedIn: 'root' })
export class GetProductByIdUseCase {
  private readonly products = inject(PRODUCTS_REPOSITORY);

  execute(id: number) {
    if (!Number.isInteger(id) || id < 1) throw new RangeError('El id debe ser un entero positivo.');
    return this.products.findById(id);
  }
}

