import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductsRepository } from '../application/ports/products.repository';
import { CreateProductInput, Product } from '../domain/product.model';

/** Adaptador HTTP que comunica los casos de uso con el microservicio de Productos. */
@Injectable({ providedIn: 'root' })
export class HttpProductsRepository implements ProductsRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3002/api/products';

  findAll(limit: number): Promise<Product[]> {
    const params = new HttpParams().set('limit', limit);
    return firstValueFrom(this.http.get<Product[]>(this.baseUrl, { params }));
  }

  findById(id: number): Promise<Product> {
    return firstValueFrom(this.http.get<Product>(`${this.baseUrl}/${id}`));
  }

  create(input: CreateProductInput): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(this.baseUrl, input));
  }
}

