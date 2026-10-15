import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BadgeAtom, BadgeType } from '@brejcha13320/design-system-bootstrap';
import { Sale, SaleStatus } from '../../interfaces/sales.interface';

@Component({
  selector: 'app-sales-table',
  templateUrl: './sales-table.component.html',
  imports: [CommonModule, BadgeAtom],
})
export class SalesTableComponent {
  @Input() sales: Sale[] = [];

  statusMap: Record<SaleStatus, BadgeType> = {
    Pendiente: 'warning',
    Pagada: 'success',
    Entregada: 'primary',
  };
}
