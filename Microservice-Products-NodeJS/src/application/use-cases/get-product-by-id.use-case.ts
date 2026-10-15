import { Product } from '../../domain/interfaces/product.interface';
import { ProductsRepository } from '../ports/products.repository';
import { CustomError } from '../../domain/erros/custom.error';

/** Caso de uso: consultar un producto por su identificador. */
export class GetProductByIdUseCase {
  constructor(private readonly products: ProductsRepository) {}

  async execute(id: number): Promise<Product> {
    if (!Number.isInteger(id) || id < 1) {
      throw CustomError.badRequest('El id debe ser un entero positivo.');
    }
    const product = await this.products.findById(id);
    if (!product) throw CustomError.notFound(`No existe el producto ${id}.`);
    return product;
  }
}

