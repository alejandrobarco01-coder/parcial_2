/**
 * Interfaz que representa una venta.
 */
export interface Sale {
  /** Identificador único de la venta */
  id: number;

  /** Nombre del cliente que realizó la compra */
  customer: string;

  /** Artículo o producto vendido */
  item: string;

  /** Cantidad de artículos comprados */
  quantity: number;

  /** Monto total de la venta en pesos */
  total: number;

  /** Estado actual de la venta */
  status: SaleStatus;
}

/** Estados permitidos para una venta. */
export type SaleStatus = 'Pendiente' | 'Pagada' | 'Entregada';

/** Datos requeridos para crear una venta sin identificador. */
export type CreateSaleInput = Omit<Sale, 'id'>;