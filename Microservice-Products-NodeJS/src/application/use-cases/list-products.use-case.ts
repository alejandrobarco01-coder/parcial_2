import { Product } from '../../domain/interfaces/product.interface';
import { ProductsRepository } from '../ports/products.repository';

/** Caso de uso: listar un número acotado de productos. */
export class ListProductsUseCase {
  constructor(private readonly products: ProductsRepository) {}

  async execute(limit = 10): Promise<Product[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('El límite debe ser un entero entre 1 y 100.');
    }
    return this.products.findAll(limit);
  }
}

