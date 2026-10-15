import { Sale } from '../interfaces/sales.interface';

export const SALES_MOCK: Sale[] = [
  { id: 1, customer: 'Ana Gómez', item: 'Leche entera', quantity: 2, total: 9000, status: 'Pagada' },
  { id: 2, customer: 'Carlos Rojas', item: 'Manzana roja', quantity: 3, total: 9600, status: 'Pendiente' },
];