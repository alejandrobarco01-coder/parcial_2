import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { CreateProductInput, Product, ProductCategory } from '../../domain/product.model';
import { State } from '../../interfaces/state.interface';
import { AlertComponent } from '../../components/alert/alert.component';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { PRODUCTS_REPOSITORY } from '../../application/ports/products.repository';
import { HttpProductsRepository } from '../../infrastructure/http-products.repository';

/**
 * Componente contenedor de productos.
 *
 * Se utiliza para gestionar y mostrar un listado de productos
 * utilizando el componente `ProductsTableComponent`.
 *
 * @remarks
 * Este componente invoca los casos de uso de Productos y entrega
 * los resultados al componente de tabla. Forma parte de la capa
 * de presentación de la aplicación.
 */
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  imports: [ProductsTableComponent, AlertComponent, FormsModule, CurrencyPipe],
  providers: [
    { provide: PRODUCTS_REPOSITORY, useClass: HttpProductsRepository },
    ListProductsUseCase,
    GetProductByIdUseCase,
    CreateProductUseCase,
  ],
})
export class ProductsPage implements OnInit {
  /** Listado de productos obtenidos desde el servicio. */
  products: Product[] = [];

  /** Estado actual del componente. */
  state: State = 'init';

  /** Producto seleccionado para ver detalle. */
  selectedProduct: Product | null = null;

  /** Mensaje informativo o de error. */
  message = '';

  /** Opciones de categorías de productos. */
  readonly categoryOptions: ProductCategory[] = ['Lacteos', 'Carnes', 'Frutas', 'Verduras'];

  /** Borrador para el formulario de registro de producto. */
  productDraft: CreateProductInput = { name: '', category: 'Lacteos', price: 1000 };

  private readonly listProducts = inject(ListProductsUseCase);
  private readonly getProductById = inject(GetProductByIdUseCase);
  private readonly createProduct = inject(CreateProductUseCase);

  ngOnInit(): void {
    void this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.state = 'loading';
    this.message = '';
    try {
      this.products = await this.listProducts.execute(10);
      this.state = 'success';
    } catch (error) {
      this.message = 'No fue posible cargar los productos. Verifica que el servicio esté activo.';
      this.state = 'error';
      console.error(error);
    }
  }

  async selectProduct(id: number): Promise<void> {
    try {
      this.selectedProduct = await this.getProductById.execute(id);
      this.message = '';
    } catch (error) {
      this.message = 'No fue posible consultar el producto seleccionado.';
      console.error(error);
    }
  }

  async registerProduct(): Promise<void> {
    try {
      const created = await this.createProduct.execute(this.productDraft);
      this.products = [created, ...this.products];
      this.productDraft = { name: '', category: 'Lacteos', price: 1000 };
      this.message = `Producto ${created.name} creado correctamente.`;
      this.state = 'success';
    } catch (error) {
      this.message = error instanceof RangeError ? error.message : 'No fue posible registrar el producto.';
      console.error(error);
    }
  }
}
