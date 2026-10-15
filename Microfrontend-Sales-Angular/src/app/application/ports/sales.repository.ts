import { InjectionToken } from '@angular/core';
import { CreateSaleInput, Sale } from '../../domain/sale.model';

/** Puerto de salida para consultar y registrar ventas. */
export interface SalesRepository {
  findAll(limit: number): Promise<Sale[]>;
  findById(id: number): Promise<Sale>;
  create(input: CreateSaleInput): Promise<Sale>;
}

export const SALES_REPOSITORY = new InjectionToken<SalesRepository>('SALES_REPOSITORY');

