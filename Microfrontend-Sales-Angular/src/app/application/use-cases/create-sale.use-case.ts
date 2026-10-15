import { inject, Injectable } from '@angular/core';
import { CreateSaleInput, SaleStatus } from '../../domain/sale.model';
import { SALES_REPOSITORY } from '../ports/sales.repository';

@Injectable({ providedIn: 'root' })
export class CreateSaleUseCase {
  private readonly sales = inject(SALES_REPOSITORY);
  private readonly validStatuses: SaleStatus[] = ['Pendiente', 'Pagada', 'Entregada'];

  execute(input: CreateSaleInput) {
    if (!input.customer.trim()) {
      throw new RangeError('El cliente es obligatorio.');
    }
    if (!input.item.trim()) {
      throw new RangeError('El artículo es obligatorio.');
    }
    if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
      throw new RangeError('La cantidad debe ser un número positivo.');
    }
    if (!Number.isFinite(input.total) || input.total <= 0) {
      throw new RangeError('El total debe ser un número positivo.');
    }
    if (!this.validStatuses.includes(input.status)) {
      throw new RangeError('El estado de la venta no es válido.');
    }
    return this.sales.create({
      ...input,
      customer: input.customer.trim(),
      item: input.item.trim(),
    });
  }
}

