export type SaleStatus = 'Pendiente' | 'Pagada' | 'Entregada';

export interface Sale {
  id: number;
  customer: string;
  item: string;
  quantity: number;
  total: number;
  status: SaleStatus;
}