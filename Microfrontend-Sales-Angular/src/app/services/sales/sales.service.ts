import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../../interfaces/sales.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private httpClient = inject(HttpClient);

  getAllSales(limit: number): Observable<Sale[]> {
    return this.httpClient.get<Sale[]>(`http://localhost:3003/api/sales?limit=${limit}`);
  }
}
