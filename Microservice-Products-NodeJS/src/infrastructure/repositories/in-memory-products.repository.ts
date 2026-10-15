import { CreateProductInput, Product } from '../../domain/interfaces/product.interface';
import { ProductsRepository } from '../../application/ports/products.repository';

/** Adaptador en memoria para persistencia de productos. */
export class InMemoryProductsRepository implements ProductsRepository {
  private readonly products: Product[] = [
    { id: 1, name: 'Leche entera', category: 'Lacteos', price: 4500 },
    { id: 2, name: 'Manzana roja', category: 'Frutas', price: 3200 },
  ];

  async findAll(limit: number): Promise<Product[]> {
    return this.products.slice(0, limit).map((product) => ({ ...product }));
  }

  async findById(id: number): Promise<Product | null> {
    const product = this.products.find((candidate) => candidate.id === id);
    return product ? { ...product } : null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product: Product = { id: this.nextId(), ...input };
    this.products.push(product);
    return { ...product };
  }

  private nextId(): number {
    return this.products.reduce((highest, product) => Math.max(highest, product.id), 0) + 1;
  }
}

