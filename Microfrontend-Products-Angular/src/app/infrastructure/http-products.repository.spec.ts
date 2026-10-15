import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PRODUCTS_MOCK } from '../mocks/products.mocks';
import { HttpProductsRepository } from './http-products.repository';

describe('HttpProductsRepository', () => {
  let repository: HttpProductsRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    repository = TestBed.inject(HttpProductsRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('solicita el listado con el límite', async () => {
    const result = repository.findAll(10);
    const request = http.expectOne((req) => req.url === 'http://localhost:3002/api/products' && req.params.get('limit') === '10');
    expect(request.request.method).toBe('GET');
    request.flush(PRODUCTS_MOCK);
    await expect(result).resolves.toEqual(PRODUCTS_MOCK);
  });

  it('solicita el detalle por id', async () => {
    const result = repository.findById(1);
    const request = http.expectOne('http://localhost:3002/api/products/1');
    expect(request.request.method).toBe('GET');
    request.flush(PRODUCTS_MOCK[0]);
    await expect(result).resolves.toEqual(PRODUCTS_MOCK[0]);
  });

  it('registra un producto', async () => {
    const input = { name: 'Arroz', category: 'Verduras' as const, price: 7000 };
    const result = repository.create(input);
    const request = http.expectOne('http://localhost:3002/api/products');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(input);
    request.flush({ id: 3, ...input });
    await expect(result).resolves.toEqual({ id: 3, ...input });
  });
});

