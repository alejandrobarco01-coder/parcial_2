import { CreateSaleInput, Sale, SaleStatus } from '../../domain/interfaces/sale.interface';
import { CustomError } from '../../domain/erros/custom.error';
import { SalesRepository } from '../ports/sales.repository';

/** Caso de uso: validar y registrar una venta. */
export class CreateSaleUseCase {
  private readonly validStatuses: SaleStatus[] = ['Pendiente', 'Pagada', 'Entregada'];

  constructor(private readonly sales: SalesRepository) {}

  async execute(input: CreateSaleInput): Promise<Sale> {
    const customer = typeof input?.customer === 'string' ? input.customer.trim() : '';
    const item = typeof input?.item === 'string' ? input.item.trim() : '';
    const quantity = input?.quantity;
    const total = input?.total;
    const status = input?.status;

    if (
      !customer ||
      !item ||
      typeof status !== 'string' ||
      !this.validStatuses.includes(status as SaleStatus) ||
      typeof quantity !== 'number' ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      typeof total !== 'number' ||
      !Number.isFinite(total) ||
      total <= 0
    ) {
      throw CustomError.badRequest('Venta inválida: cliente, artículo, cantidad positiva, total positivo y estado válido son obligatorios.');
    }

    return this.sales.create({
      customer,
      item,
      quantity,
      total,
      status: status as SaleStatus,
    });
  }
}

