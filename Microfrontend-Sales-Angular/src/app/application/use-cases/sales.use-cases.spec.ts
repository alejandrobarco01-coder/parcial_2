import { TestBed } from '@angular/core/testing';
import { SALES_REPOSITORY, SalesRepository } from '../ports/sales.repository';
import { CreateSaleUseCase } from './create-sale.use-case';
import { GetSaleByIdUseCase } from './get-sale-by-id.use-case';
import { ListSalesUseCase } from './list-sales.use-case';
import { SALES_MOCK } from '../../mocks/sales.mocks';

describe('Casos de uso de ventas', () => {
  let repository: jest.Mocked<SalesRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn().mockResolvedValue(SALES_MOCK),
      findById: jest.fn().mockResolvedValue(SALES_MOCK[0]),
      create: jest.fn().mockImplementation(async (input) => ({ id: 3, ...input })),
    };
    TestBed.configureTestingModule({ providers: [{ provide: SALES_REPOSITORY, useValue: repository }] });
  });

  it('lista ventas con el límite predeterminado o explícito', async () => {
    const useCase = TestBed.inject(ListSalesUseCase);
    await expect(useCase.execute()).resolves.toEqual(SALES_MOCK);
    await useCase.execute(5);
    expect(repository.findAll).toHaveBeenNthCalledWith(1, 10);
    expect(repository.findAll).toHaveBeenNthCalledWith(2, 5);
  });

  it('rechaza límites inválidos', () => {
    const useCase = TestBed.inject(ListSalesUseCase);
    expect(() => useCase.execute(0)).toThrow(RangeError);
    expect(() => useCase.execute(101)).toThrow(RangeError);
    expect(() => useCase.execute(2.5)).toThrow(RangeError);
  });

  it('consulta una venta por identificador', async () => {
    await expect(TestBed.inject(GetSaleByIdUseCase).execute(1)).resolves.toEqual(SALES_MOCK[0]);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('rechaza identificadores no positivos o fraccionarios', () => {
    const useCase = TestBed.inject(GetSaleByIdUseCase);
    expect(() => useCase.execute(0)).toThrow(RangeError);
    expect(() => useCase.execute(1.5)).toThrow(RangeError);
  });

  it('valida datos, normaliza cliente y artículo y registra la venta', async () => {
    const useCase = TestBed.inject(CreateSaleUseCase);
    const input = { customer: '  Carlos Rojas  ', item: '  Manzana roja  ', quantity: 3, total: 9600, status: 'Pendiente' as const };
    await expect(useCase.execute(input)).resolves.toEqual(expect.objectContaining({ customer: 'Carlos Rojas', item: 'Manzana roja', quantity: 3, total: 9600 }));
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ customer: 'Carlos Rojas' }));
  });

  it('rechaza cliente, artículo, cantidad, total y estado inválidos', () => {
    const useCase = TestBed.inject(CreateSaleUseCase);
    expect(() => useCase.execute({ customer: '  ', item: 'X', quantity: 1, total: 10, status: 'Pagada' })).toThrow(RangeError);
    expect(() => useCase.execute({ customer: 'A', item: '  ', quantity: 1, total: 10, status: 'Pagada' })).toThrow(RangeError);
    expect(() => useCase.execute({ customer: 'A', item: 'X', quantity: 0, total: 10, status: 'Pagada' })).toThrow(RangeError);
    expect(() => useCase.execute({ customer: 'A', item: 'X', quantity: -1, total: 10, status: 'Pagada' })).toThrow(RangeError);
    expect(() => useCase.execute({ customer: 'A', item: 'X', quantity: NaN, total: 10, status: 'Pagada' })).toThrow(RangeError);
    expect(() => useCase.execute({ customer: 'A', item: 'X', quantity: 1, total: 0, status: 'Pagada' })).toThrow(RangeError);
    expect(() => useCase.execute({ customer: 'A', item: 'X', quantity: 1, total: -50, status: 'Pagada' })).toThrow(RangeError);
    expect(() => useCase.execute({ customer: 'A', item: 'X', quantity: 1, total: 10, status: 'Cancelada' as any })).toThrow(RangeError);
  });
});

