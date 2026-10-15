import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SALES_REPOSITORY, SalesRepository } from '../../application/ports/sales.repository';
import { CreateSaleInput, Sale } from '../../domain/sale.model';
import { SALES_MOCK } from '../../mocks/sales.mocks';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { GetSaleByIdUseCase } from '../../application/use-cases/get-sale-by-id.use-case';
import { CreateSaleUseCase } from '../../application/use-cases/create-sale.use-case';
import { SalesPage } from './sales.page';

describe('SalesPage', () => {
  let fixture: ComponentFixture<SalesPage>;
  let repository: jest.Mocked<SalesRepository>;

  beforeEach(async () => {
    repository = {
      findAll: jest.fn().mockResolvedValue(SALES_MOCK),
      findById: jest.fn().mockImplementation(async (id: number) => SALES_MOCK.find((s) => s.id === id)!),
      create: jest.fn().mockImplementation(async (input: CreateSaleInput) => ({ id: 3, ...input })),
    };
    TestBed.overrideComponent(SalesPage, {
      set: {
        providers: [
          { provide: SALES_REPOSITORY, useValue: repository },
          ListSalesUseCase,
          GetSaleByIdUseCase,
          CreateSaleUseCase,
        ],
      },
    });
    await TestBed.configureTestingModule({
      imports: [SalesPage],
      providers: [{ provide: SALES_REPOSITORY, useValue: repository }],
    }).compileComponents();
    fixture = TestBed.createComponent(SalesPage);
  });

  it('carga y renderiza ventas al iniciar', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(repository.findAll).toHaveBeenCalledWith(10);
    expect(fixture.nativeElement.textContent).toContain('Ana Gómez');
  });

  it('muestra estado de error cuando falla la carga', async () => {
    repository.findAll.mockRejectedValueOnce(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.state).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('Error al cargar las ventas');
  });

  it('consulta el detalle de la venta seleccionada', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.selectSale(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.selectedSale?.id).toBe(1);
  });

  it('muestra mensaje cuando falla la consulta de detalle', async () => {
    repository.findById.mockRejectedValueOnce(new Error('not found'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.selectSale(500);
    expect(fixture.componentInstance.message).toContain('consultar la venta');
  });

  it('registra una venta y limpia el formulario', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const draft = fixture.componentInstance.saleDraft;
    Object.assign(draft, { customer: '  Laura  ', item: '  Pan  ', quantity: 2, total: 3000, status: 'Entregada' });
    await fixture.componentInstance.registerSale();
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ customer: 'Laura', item: 'Pan' }));
    expect(fixture.componentInstance.sales[0].id).toBe(3);
    expect(fixture.componentInstance.saleDraft.customer).toBe('');
    expect(fixture.componentInstance.message).toContain('registrada correctamente');
  });

  it('muestra validaciones de negocio al registrar', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    Object.assign(fixture.componentInstance.saleDraft, {
      customer: '',
      item: 'Pan',
      quantity: 1,
      total: 1000,
      status: 'Pendiente',
    });
    await fixture.componentInstance.registerSale();
    expect(repository.create).not.toHaveBeenCalled();
    expect(fixture.componentInstance.message).toContain('cliente');
  });

  it('muestra un mensaje cuando falla el registro en el servidor', async () => {
    repository.create.mockRejectedValueOnce(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    Object.assign(fixture.componentInstance.saleDraft, {
      customer: 'Laura',
      item: 'Pan',
      quantity: 1,
      total: 1000,
      status: 'Pendiente',
    });
    await fixture.componentInstance.registerSale();
    expect(fixture.componentInstance.message).toContain('registrar la venta');
  });

  it('permite forzar la actualización del listado', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.loadSales();
    expect(repository.findAll).toHaveBeenCalledTimes(2);
  });
});
