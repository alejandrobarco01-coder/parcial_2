import { inject, Injectable } from '@angular/core';
import { SALES_REPOSITORY } from '../ports/sales.repository';

@Injectable({ providedIn: 'root' })
export class GetSaleByIdUseCase {
  private readonly sales = inject(SALES_REPOSITORY);

  execute(id: number) {
    if (!Number.isInteger(id) || id < 1) throw new RangeError('El id debe ser un entero positivo.');
    return this.sales.findById(id);
  }
}

