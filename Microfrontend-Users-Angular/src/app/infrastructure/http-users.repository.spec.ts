import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { USERS_MOCK } from '../mocks/users.mocks';
import { HttpUsersRepository } from './http-users.repository';

describe('HttpUsersRepository', () => {
  let repository: HttpUsersRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    repository = TestBed.inject(HttpUsersRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('solicita el listado con el límite', async () => {
    const result = repository.findAll(10);
    const request = http.expectOne((req) => req.url === 'http://localhost:3001/api/users' && req.params.get('limit') === '10');
    expect(request.request.method).toBe('GET');
    request.flush(USERS_MOCK);
    await expect(result).resolves.toEqual(USERS_MOCK);
  });

  it('solicita el detalle por id', async () => {
    const result = repository.findById(1);
    const request = http.expectOne('http://localhost:3001/api/users/1');
    expect(request.request.method).toBe('GET');
    request.flush(USERS_MOCK[0]);
    await expect(result).resolves.toEqual(USERS_MOCK[0]);
  });

  it('registra un usuario', async () => {
    const input = { name: 'Eva', lastName: 'Ruiz', age: 25, email: 'eva@example.com', engineering: 'Industrial' as const };
    const result = repository.create(input);
    const request = http.expectOne('http://localhost:3001/api/users');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(input);
    request.flush({ id: 3, ...input });
    await expect(result).resolves.toEqual({ id: 3, ...input });
  });
});
