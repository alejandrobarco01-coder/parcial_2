import { Sale, CreateSaleInput } from '../../domain/interfaces/sale.interface';

/** Puerto que define las operaciones de persistencia de ventas. */
export interface SalesRepository {
  findAll(limit: number): Promise<Sale[]>;
  findById(id: number): Promise<Sale | null>;
  create(input: CreateSaleInput): Promise<Sale>;
}

