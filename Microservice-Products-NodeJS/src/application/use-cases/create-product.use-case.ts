import { CreateProductInput, Product, ProductCategory } from '../../domain/interfaces/product.interface';
import { CustomError } from '../../domain/erros/custom.error';
import { ProductsRepository } from '../ports/products.repository';

/** Caso de uso: validar y registrar un producto. */
export class CreateProductUseCase {
  private readonly validCategories: ProductCategory[] = ['Carnes', 'Frutas', 'Lacteos', 'Verduras'];

  constructor(private readonly products: ProductsRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const name = typeof input?.name === 'string' ? input.name.trim() : '';
    const category = input?.category;
    const price = input?.price;

    if (!name || typeof category !== 'string' || !this.validCategories.includes(category as ProductCategory) || typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
      throw CustomError.badRequest('Producto inválido: nombre, categoría válida y precio positivo son obligatorios.');
    }

    return this.products.create({ name, category: category as ProductCategory, price });
  }
}

