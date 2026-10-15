import { Component, inject } from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import { SalesTableComponent } from '../../components/sales-table/sales-table.component';
import { Sale } from '../../interfaces/sales.interface';
import { State } from '../../interfaces/state.interface';
import { SalesService } from '../../services/sales/sales.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  imports: [SalesTableComponent, AlertComponent],
})
export class SalesPage {
  sales: Sale[] = [];
  state: State = 'init';
  private salesService = inject(SalesService);

  ngOnInit(): void {
    this.state = 'loading';
    this.salesService.getAllSales(10).subscribe({
      next: (sales) => {
        this.sales = sales;
        this.state = 'success';
      },
      error: (error) => {
        console.error(error);
        this.state = 'error';
      },
    });
  }
}
