import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PRODUCTS_REPOSITORY, ProductsRepository } from '../../application/ports/products.repository';
import { CreateProductInput, Product } from '../../domain/product.model';
import { PRODUCTS_MOCK } from '../../mocks/products.mocks';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { ProductsPage } from './products.page';

describe('ProductsPage', () => {
  let fixture: ComponentFixture<ProductsPage>;
  let repository: jest.Mocked<ProductsRepository>;

  beforeEach(async () => {
    repository = {
      findAll: jest.fn().mockResolvedValue(PRODUCTS_MOCK),
      findById: jest.fn().mockImplementation(async (id: number) => PRODUCTS_MOCK.find((p) => p.id === id)!),
      create: jest.fn().mockImplementation(async (input: CreateProductInput) => ({ id: 3, ...input })),
    };
    TestBed.overrideComponent(ProductsPage, {
      set: {
        providers: [
          { provide: PRODUCTS_REPOSITORY, useValue: repository },
          ListProductsUseCase,
          GetProductByIdUseCase,
          CreateProductUseCase,
        ],
      },
    });
    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [{ provide: PRODUCTS_REPOSITORY, useValue: repository }],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductsPage);
  });

  it('carga y renderiza productos al iniciar', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(repository.findAll).toHaveBeenCalledWith(10);
    expect(fixture.nativeElement.textContent).toContain('Leche entera');
  });

  it('muestra estado de error cuando falla la carga', async () => {
    repository.findAll.mockRejectedValueOnce(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.state).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('Error al cargar los productos');
  });

  it('consulta el detalle del producto seleccionado', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.selectProduct(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.selectedProduct?.id).toBe(1);
  });

  it('muestra mensaje cuando falla la consulta de detalle', async () => {
    repository.findById.mockRejectedValueOnce(new Error('not found'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.selectProduct(500);
    expect(fixture.componentInstance.message).toContain('consultar el producto');
  });

  it('registra un producto y limpia el formulario', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const draft = fixture.componentInstance.productDraft;
    Object.assign(draft, { name: '  Arroz  ', category: 'Verduras', price: 7000 });
    await fixture.componentInstance.registerProduct();
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Arroz' }));
    expect(fixture.componentInstance.products[0].id).toBe(3);
    expect(fixture.componentInstance.productDraft.name).toBe('');
    expect(fixture.componentInstance.message).toContain('creado correctamente');
  });

  it('muestra validaciones de negocio al registrar', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    Object.assign(fixture.componentInstance.productDraft, {
      name: '',
      category: 'Lacteos',
      price: 1000,
    });
    await fixture.componentInstance.registerProduct();
    expect(repository.create).not.toHaveBeenCalled();
    expect(fixture.componentInstance.message).toContain('nombre del producto');
  });

  it('muestra un mensaje cuando falla el registro en el servidor', async () => {
    repository.create.mockRejectedValueOnce(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    Object.assign(fixture.componentInstance.productDraft, {
      name: 'Arroz',
      category: 'Verduras',
      price: 7000,
    });
    await fixture.componentInstance.registerProduct();
    expect(fixture.componentInstance.message).toContain('registrar el producto');
  });

  it('permite forzar la actualización del listado', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.loadProducts();
    expect(repository.findAll).toHaveBeenCalledTimes(2);
  });
});
