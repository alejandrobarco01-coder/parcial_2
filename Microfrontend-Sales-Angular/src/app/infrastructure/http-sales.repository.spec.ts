import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SALES_MOCK } from '../mocks/sales.mocks';
import { HttpSalesRepository } from './http-sales.repository';

describe('HttpSalesRepository', () => {
  let repository: HttpSalesRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    repository = TestBed.inject(HttpSalesRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('solicita el listado con el límite', async () => {
    const result = repository.findAll(10);
    const request = http.expectOne((req) => req.url === 'http://localhost:3003/api/sales' && req.params.get('limit') === '10');
    expect(request.request.method).toBe('GET');
    request.flush(SALES_MOCK);
    await expect(result).resolves.toEqual(SALES_MOCK);
  });

  it('solicita el detalle por id', async () => {
    const result = repository.findById(1);
    const request = http.expectOne('http://localhost:3003/api/sales/1');
    expect(request.request.method).toBe('GET');
    request.flush(SALES_MOCK[0]);
    await expect(result).resolves.toEqual(SALES_MOCK[0]);
  });

  it('registra una venta', async () => {
    const input = { customer: 'Laura', item: 'Pan', quantity: 1, total: 2000, status: 'Entregada' as const };
    const result = repository.create(input);
    const request = http.expectOne('http://localhost:3003/api/sales');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(input);
    request.flush({ id: 3, ...input });
    await expect(result).resolves.toEqual({ id: 3, ...input });
  });
});

