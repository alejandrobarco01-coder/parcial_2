import { Product, ProductCategory } from '../../../domain/interfaces/product.interface';

export type CreateProduct = Omit<Product, 'id'>;

/**
 * Servicio encargado de la generación y gestión de productos.
 *
 * @remarks
 * Este servicio utiliza la librería `faker` para generar productos
 * ficticios, principalmente con fines de prueba o demostración.
 */
export class ProductsService {
  private readonly products: Product[] = [
    { id: 1, name: 'Leche entera', category: 'Lacteos', price: 4500 },
    { id: 2, name: 'Manzana roja', category: 'Frutas', price: 3200 },
  ];

  /**
   * Categorías disponibles para los productos.
   *
   * @remarks
   * Se utilizan para asignar aleatoriamente una categoría
   * a cada producto generado.
   */
  private categories: ProductCategory[] = [
    'Carnes',
    'Frutas',
    'Lacteos',
    'Verduras'
  ];

  /**
   * Obtiene un listado de productos generados dinámicamente.
   *
   * @param countProducts Cantidad de productos a generar
   * @returns Promesa que resuelve un arreglo de productos
   *
   * @example
   * ```ts
   * const products = await productsService.getAllProducts(10);
   * ```
   */
  public async getAllProducts(limit = 10): Promise<Product[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('limit debe estar entre 1 y 100');
    }
    return this.products.slice(0, limit);
  }

  /**
   * Genera un producto ficticio.
   *
   * @param id Identificador único del producto
   * @returns Promesa que resuelve un producto generado
   */
  public async getProductById(id: number): Promise<Product | undefined> {
    return this.products.find((product) => product.id === id);
  }

  public async createProduct(input: CreateProduct): Promise<Product> {
    if (!input.name?.trim() || !this.categories.includes(input.category) || !Number.isFinite(input.price) || input.price <= 0) {
      throw new Error('Producto inválido');
    }
    const product = { ...input, name: input.name.trim(), id: Math.max(0, ...this.products.map((item) => item.id)) + 1 };
    this.products.push(product);
    return product;
  }
}
