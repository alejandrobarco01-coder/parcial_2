import { Sale } from '../../domain/interfaces/sale.interface';
import { SalesRepository } from '../ports/sales.repository';
import { CustomError } from '../../domain/erros/custom.error';

/** Caso de uso: consultar una venta por su identificador. */
export class GetSaleByIdUseCase {
  constructor(private readonly sales: SalesRepository) {}

  async execute(id: number): Promise<Sale> {
    if (!Number.isInteger(id) || id < 1) {
      throw CustomError.badRequest('El id debe ser un entero positivo.');
    }
    const sale = await this.sales.findById(id);
    if (!sale) throw CustomError.notFound(`No existe la venta ${id}.`);
    return sale;
  }
}

