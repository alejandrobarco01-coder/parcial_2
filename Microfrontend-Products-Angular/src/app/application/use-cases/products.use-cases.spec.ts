import { TestBed } from '@angular/core/testing';
import { PRODUCTS_REPOSITORY, ProductsRepository } from '../ports/products.repository';
import { CreateProductUseCase } from './create-product.use-case';
import { GetProductByIdUseCase } from './get-product-by-id.use-case';
import { ListProductsUseCase } from './list-products.use-case';
import { PRODUCTS_MOCK } from '../../mocks/products.mocks';

describe('Casos de uso de productos', () => {
  let repository: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn().mockResolvedValue(PRODUCTS_MOCK),
      findById: jest.fn().mockResolvedValue(PRODUCTS_MOCK[0]),
      create: jest.fn().mockImplementation(async (input) => ({ id: 3, ...input })),
    };
    TestBed.configureTestingModule({ providers: [{ provide: PRODUCTS_REPOSITORY, useValue: repository }] });
  });

  it('lista productos con el límite predeterminado o explícito', async () => {
    const useCase = TestBed.inject(ListProductsUseCase);
    await expect(useCase.execute()).resolves.toEqual(PRODUCTS_MOCK);
    await useCase.execute(5);
    expect(repository.findAll).toHaveBeenNthCalledWith(1, 10);
    expect(repository.findAll).toHaveBeenNthCalledWith(2, 5);
  });

  it('rechaza límites inválidos', () => {
    const useCase = TestBed.inject(ListProductsUseCase);
    expect(() => useCase.execute(0)).toThrow(RangeError);
    expect(() => useCase.execute(101)).toThrow(RangeError);
    expect(() => useCase.execute(2.5)).toThrow(RangeError);
  });

  it('consulta un producto por identificador', async () => {
    await expect(TestBed.inject(GetProductByIdUseCase).execute(1)).resolves.toEqual(PRODUCTS_MOCK[0]);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('rechaza identificadores no positivos o fraccionarios', () => {
    const useCase = TestBed.inject(GetProductByIdUseCase);
    expect(() => useCase.execute(0)).toThrow(RangeError);
    expect(() => useCase.execute(1.5)).toThrow(RangeError);
  });

  it('valida datos, normaliza el nombre y registra el producto', async () => {
    const useCase = TestBed.inject(CreateProductUseCase);
    const input = { name: '  Arroz  ', category: 'Verduras' as const, price: 7000 };
    await expect(useCase.execute(input)).resolves.toEqual(expect.objectContaining({ name: 'Arroz', category: 'Verduras', price: 7000 }));
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Arroz' }));
  });

  it('rechaza nombre, categoría y precio inválidos', () => {
    const useCase = TestBed.inject(CreateProductUseCase);
    expect(() => useCase.execute({ name: '  ', category: 'Carnes', price: 1000 })).toThrow(RangeError);
    expect(() => useCase.execute({ name: 'Arroz', category: 'Inexistente' as any, price: 1000 })).toThrow(RangeError);
    expect(() => useCase.execute({ name: 'Arroz', category: 'Carnes', price: 0 })).toThrow(RangeError);
    expect(() => useCase.execute({ name: 'Arroz', category: 'Carnes', price: -500 })).toThrow(RangeError);
    expect(() => useCase.execute({ name: 'Arroz', category: 'Carnes', price: NaN })).toThrow(RangeError);
  });
});

