import { inject, Injectable } from '@angular/core';
import { SALES_REPOSITORY } from '../ports/sales.repository';

@Injectable({ providedIn: 'root' })
export class ListSalesUseCase {
  private readonly sales = inject(SALES_REPOSITORY);

  execute(limit = 10) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('El límite debe ser un entero entre 1 y 100.');
    }
    return this.sales.findAll(limit);
  }
}

