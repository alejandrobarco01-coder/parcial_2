import { Product, CreateProductInput } from '../../domain/interfaces/product.interface';

/** Puerto que define las operaciones de persistencia de productos. */
export interface ProductsRepository {
  findAll(limit: number): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
}

