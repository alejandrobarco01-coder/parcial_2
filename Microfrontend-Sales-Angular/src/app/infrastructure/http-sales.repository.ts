import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SalesRepository } from '../application/ports/sales.repository';
import { CreateSaleInput, Sale } from '../domain/sale.model';

/** Adaptador HTTP que comunica los casos de uso con el microservicio de Ventas. */
@Injectable({ providedIn: 'root' })
export class HttpSalesRepository implements SalesRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3003/api/sales';

  findAll(limit: number): Promise<Sale[]> {
    const params = new HttpParams().set('limit', limit);
    return firstValueFrom(this.http.get<Sale[]>(this.baseUrl, { params }));
  }

  findById(id: number): Promise<Sale> {
    return firstValueFrom(this.http.get<Sale>(`${this.baseUrl}/${id}`));
  }

  create(input: CreateSaleInput): Promise<Sale> {
    return firstValueFrom(this.http.post<Sale>(this.baseUrl, input));
  }
}

