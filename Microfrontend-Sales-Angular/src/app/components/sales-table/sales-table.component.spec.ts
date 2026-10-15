import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SALES_MOCK } from '../../mocks/sales.mocks';
import { SalesTableComponent } from './sales-table.component';

describe('SalesTableComponent', () => {
  let component: SalesTableComponent;
  let fixture: ComponentFixture<SalesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar una tabla', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });

  it('debería renderizar una fila por cada venta', () => {
    component.sales = SALES_MOCK;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(component.sales.length);
  });

  it('debería mostrar los datos de la venta en cada columna', () => {
    component.sales = SALES_MOCK;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

    rows.forEach((row, index) => {
      const columns = row.queryAll(By.css('th, td'));
      const sale = component.sales[index];

      expect(columns[0].nativeElement.textContent.trim()).toBe(String(sale.id));
      expect(columns[1].nativeElement.textContent.trim()).toBe(sale.customer);
      expect(columns[2].nativeElement.textContent.trim()).toBe(sale.item);
      expect(columns[3].nativeElement.textContent.trim()).toBe(String(sale.quantity));
      expect(columns[4].nativeElement.textContent.trim()).toBe('$' + sale.total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') );
      expect(columns[5].nativeElement.textContent.trim()).toContain(sale.status);
    });
  });

  it('debería mapear cada estado a su BadgeType correcto', () => {
    expect(component.statusMap['Pendiente']).toBe('warning');
    expect(component.statusMap['Pagada']).toBe('success');
    expect(component.statusMap['Entregada']).toBe('primary');
  });
});
