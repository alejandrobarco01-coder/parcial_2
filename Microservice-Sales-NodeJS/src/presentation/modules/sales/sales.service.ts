import { Sale, SaleStatus } from '../../../domain/interfaces/sale.interface';

export type CreateSale = Omit<Sale, 'id'>;

export class SalesService {
  private readonly sales: Sale[] = [
    { id: 1, customer: 'Ana Gómez', item: 'Leche entera', quantity: 2, total: 9000, status: 'Pagada' },
    { id: 2, customer: 'Carlos Rojas', item: 'Manzana roja', quantity: 3, total: 9600, status: 'Pendiente' },
  ];

  private readonly statuses: SaleStatus[] = ['Pendiente', 'Pagada', 'Entregada'];

  public async getAllSales(limit = 10): Promise<Sale[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('limit debe estar entre 1 y 100');
    }
    return this.sales.slice(0, limit);
  }

  public async getSaleById(id: number): Promise<Sale | undefined> {
    return this.sales.find((sale) => sale.id === id);
  }

  public async createSale(input: CreateSale): Promise<Sale> {
    if (
      !input.customer?.trim() ||
      !input.item?.trim() ||
      !this.statuses.includes(input.status) ||
      !Number.isFinite(input.quantity) ||
      input.quantity <= 0 ||
      !Number.isFinite(input.total) ||
      input.total <= 0
    ) {
      throw new Error('Venta inválida');
    }

    const sale: Sale = {
      ...input,
      customer: input.customer.trim(),
      item: input.item.trim(),
      id: Math.max(0, ...this.sales.map((item) => item.id)) + 1,
    };

    this.sales.push(sale);
    return sale;
  }
}
