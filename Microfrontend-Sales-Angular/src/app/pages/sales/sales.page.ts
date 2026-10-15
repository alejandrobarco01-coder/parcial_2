import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { AlertComponent } from '../../components/alert/alert.component';
import { SalesTableComponent } from '../../components/sales-table/sales-table.component';
import { CreateSaleInput, Sale, SaleStatus } from '../../domain/sale.model';
import { State } from '../../interfaces/state.interface';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { GetSaleByIdUseCase } from '../../application/use-cases/get-sale-by-id.use-case';
import { CreateSaleUseCase } from '../../application/use-cases/create-sale.use-case';
import { SALES_REPOSITORY } from '../../application/ports/sales.repository';
import { HttpSalesRepository } from '../../infrastructure/http-sales.repository';

/**
 * Componente contenedor de ventas.
 *
 * Se utiliza para gestionar y mostrar un listado de ventas
 * utilizando el componente `SalesTableComponent`.
 *
 * @remarks
 * Este componente invoca los casos de uso de Ventas y entrega
 * los resultados al componente de tabla. Forma parte de la capa
 * de presentación de la aplicación.
 */
@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  imports: [SalesTableComponent, AlertComponent, FormsModule, CurrencyPipe],
  providers: [
    { provide: SALES_REPOSITORY, useClass: HttpSalesRepository },
    ListSalesUseCase,
    GetSaleByIdUseCase,
    CreateSaleUseCase,
  ],
})
export class SalesPage implements OnInit {
  sales: Sale[] = [];
  state: State = 'init';
  selectedSale: Sale | null = null;
  message = '';
  readonly statusOptions: SaleStatus[] = ['Pendiente', 'Pagada', 'Entregada'];
  saleDraft: CreateSaleInput = { customer: '', item: '', quantity: 1, total: 1000, status: 'Pendiente' };

  private readonly listSales = inject(ListSalesUseCase);
  private readonly getSaleById = inject(GetSaleByIdUseCase);
  private readonly createSale = inject(CreateSaleUseCase);

  ngOnInit(): void {
    void this.loadSales();
  }

  async loadSales(): Promise<void> {
    this.state = 'loading';
    this.message = '';
    try {
      this.sales = await this.listSales.execute(10);
      this.state = 'success';
    } catch (error) {
      this.message = 'No fue posible cargar las ventas. Verifica que el servicio esté activo.';
      this.state = 'error';
      console.error(error);
    }
  }

  async selectSale(id: number): Promise<void> {
    try {
      this.selectedSale = await this.getSaleById.execute(id);
      this.message = '';
    } catch (error) {
      this.message = 'No fue posible consultar la venta seleccionada.';
      console.error(error);
    }
  }

  async registerSale(): Promise<void> {
    try {
      const created = await this.createSale.execute(this.saleDraft);
      this.sales = [created, ...this.sales];
      this.saleDraft = { customer: '', item: '', quantity: 1, total: 1000, status: 'Pendiente' };
      this.message = `Venta #${created.id} registrada correctamente.`;
      this.state = 'success';
    } catch (error) {
      this.message = error instanceof RangeError ? error.message : 'No fue posible registrar la venta.';
      console.error(error);
    }
  }
}
