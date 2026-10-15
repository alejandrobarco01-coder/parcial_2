import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Sale } from '../../interfaces/sales.interface';
import { SALES_MOCK } from '../../mocks/sales.mocks';
import { SalesService } from './sales.service';

describe('SalesService', () => {
  let service: SalesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar una petición GET y retornar una lista de ventas', () => {
    const limit = 5;
    const mockSales: Sale[] = SALES_MOCK;

    service.getAllSales(limit).subscribe((sales) => {
      expect(sales).toEqual(mockSales);
      expect(sales.length).toBe(mockSales.length);
    });

    const req = httpMock.expectOne(`http://localhost:3003/api/sales?limit=${limit}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockSales);
  });

  it('debería propagar un error si la petición HTTP falla', () => {
    const limit = 3;

    service.getAllSales(limit).subscribe({
      next: () => fail('No debería emitir datos cuando ocurre un error'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`http://localhost:3003/api/sales?limit=${limit}`);

    req.flush(
      { message: 'Error interno del servidor' },
      { status: 500, statusText: 'Internal Server Error' },
    );
  });
});
