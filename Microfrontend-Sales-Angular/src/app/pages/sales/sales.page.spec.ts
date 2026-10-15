import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { SalesPage } from './sales.page';
import { SalesService } from '../../services/sales/sales.service';
import { SalesTableComponent } from '../../components/sales-table/sales-table.component';
import { SALES_MOCK } from '../../mocks/sales.mocks';

describe('SalesPage', () => {
  let component: SalesPage;
  let fixture: ComponentFixture<SalesPage>;
  let salesService: SalesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPage, SalesTableComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesPage);
    component = fixture.componentInstance;
    salesService = TestBed.inject(SalesService);
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a getAllSales al iniciar', () => {
    const spy = jest.spyOn(salesService, 'getAllSales').mockReturnValue(of(SALES_MOCK));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('debería asignar las ventas recibidas del servicio', () => {
    jest.spyOn(salesService, 'getAllSales').mockReturnValue(of(SALES_MOCK));
    fixture.detectChanges();
    expect(component.sales).toEqual(SALES_MOCK);
  });

  it('debería pasar las ventas al componente sales-table', () => {
    jest.spyOn(salesService, 'getAllSales').mockReturnValue(of(SALES_MOCK));
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.directive(SalesTableComponent)).componentInstance;
    expect(table.sales).toEqual(SALES_MOCK);
  });

  it('debería manejar el error cuando falla getAllSales', () => {
    component.sales = [];
    const errorResponse = new Error('Error al cargar ventas');

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(salesService, 'getAllSales').mockReturnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(salesService.getAllSales).toHaveBeenCalledWith(10);
    expect(console.error).toHaveBeenCalledWith(errorResponse);
    expect(component.sales.length).toBe(0);
  });
});
