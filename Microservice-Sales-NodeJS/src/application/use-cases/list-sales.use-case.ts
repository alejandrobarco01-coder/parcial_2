import { Sale } from '../../domain/interfaces/sale.interface';
import { SalesRepository } from '../ports/sales.repository';

/** Caso de uso: listar un número acotado de ventas. */
export class ListSalesUseCase {
  constructor(private readonly sales: SalesRepository) {}

  async execute(limit = 10): Promise<Sale[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('El límite debe ser un entero entre 1 y 100.');
    }
    return this.sales.findAll(limit);
  }
}

