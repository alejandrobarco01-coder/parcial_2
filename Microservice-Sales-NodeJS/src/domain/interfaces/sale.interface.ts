/**
 * Interfaz que representa una venta.
 */
export interface Sale {
  id: number;
  customer: string;
  item: string;
  quantity: number;
  total: number;
  status: SaleStatus;
}

export type SaleStatus = 'Pendiente' | 'Pagada' | 'Entregada';