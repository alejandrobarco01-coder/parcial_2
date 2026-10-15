import { CreateSaleInput, Sale } from '../../domain/interfaces/sale.interface';
import { SalesRepository } from '../../application/ports/sales.repository';

/** Adaptador en memoria para persistencia de ventas. */
export class InMemorySalesRepository implements SalesRepository {
  private readonly sales: Sale[] = [
    { id: 1, customer: 'Ana Gómez', item: 'Leche entera', quantity: 2, total: 9000, status: 'Pagada' },
    { id: 2, customer: 'Carlos Rojas', item: 'Manzana roja', quantity: 3, total: 9600, status: 'Pendiente' },
  ];

  async findAll(limit: number): Promise<Sale[]> {
    return this.sales.slice(0, limit).map((sale) => ({ ...sale }));
  }

  async findById(id: number): Promise<Sale | null> {
    const sale = this.sales.find((candidate) => candidate.id === id);
    return sale ? { ...sale } : null;
  }

  async create(input: CreateSaleInput): Promise<Sale> {
    const sale: Sale = { id: this.nextId(), ...input };
    this.sales.push(sale);
    return { ...sale };
  }

  private nextId(): number {
    return this.sales.reduce((highest, sale) => Math.max(highest, sale.id), 0) + 1;
  }
}

