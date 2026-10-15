import { TestBed } from '@angular/core/testing';
import { USERS_REPOSITORY, UsersRepository } from '../ports/users.repository';
import { CreateUserUseCase } from './create-user.use-case';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { ListUsersUseCase } from './list-users.use-case';
import { USERS_MOCK } from '../../mocks/users.mocks';

describe('Casos de uso de usuarios', () => {
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn().mockResolvedValue(USERS_MOCK),
      findById: jest.fn().mockResolvedValue(USERS_MOCK[0]),
      create: jest.fn().mockImplementation(async (input) => ({ id: 3, ...input })),
    };
    TestBed.configureTestingModule({ providers: [{ provide: USERS_REPOSITORY, useValue: repository }] });
  });

  it('lista usuarios con el límite predeterminado o explícito', async () => {
    const useCase = TestBed.inject(ListUsersUseCase);
    await expect(useCase.execute()).resolves.toEqual(USERS_MOCK);
    await useCase.execute(5);
    expect(repository.findAll).toHaveBeenNthCalledWith(1, 10);
    expect(repository.findAll).toHaveBeenNthCalledWith(2, 5);
  });

  it('rechaza límites inválidos', () => {
    const useCase = TestBed.inject(ListUsersUseCase);
    expect(() => useCase.execute(0)).toThrow(RangeError);
    expect(() => useCase.execute(101)).toThrow(RangeError);
    expect(() => useCase.execute(2.5)).toThrow(RangeError);
  });

  it('consulta un usuario por identificador', async () => {
    await expect(TestBed.inject(GetUserByIdUseCase).execute(1)).resolves.toEqual(USERS_MOCK[0]);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('rechaza identificadores no positivos o fraccionarios', () => {
    const useCase = TestBed.inject(GetUserByIdUseCase);
    expect(() => useCase.execute(0)).toThrow(RangeError);
    expect(() => useCase.execute(1.5)).toThrow(RangeError);
  });

  it('valida datos, normaliza el correo y registra el usuario', async () => {
    const useCase = TestBed.inject(CreateUserUseCase);
    const input = { ...USERS_MOCK[0], id: undefined, name: ' Ana ', lastName: ' Gómez ', email: ' ANA@EXAMPLE.COM ' };
    await expect(useCase.execute(input)).resolves.toEqual(expect.objectContaining({ name: 'Ana', lastName: 'Gómez', email: 'ana@example.com' }));
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'ana@example.com' }));
  });

  it('rechaza nombre, apellido, edad y correo inválidos', () => {
    const useCase = TestBed.inject(CreateUserUseCase);
    const base = { ...USERS_MOCK[0], id: undefined };
    expect(() => useCase.execute({ ...base, name: ' ' })).toThrow(RangeError);
    expect(() => useCase.execute({ ...base, lastName: '' })).toThrow(RangeError);
    expect(() => useCase.execute({ ...base, age: 17 })).toThrow(RangeError);
    expect(() => useCase.execute({ ...base, age: 101 })).toThrow(RangeError);
    expect(() => useCase.execute({ ...base, age: 20.5 })).toThrow(RangeError);
    expect(() => useCase.execute({ ...base, email: 'invalido' })).toThrow(RangeError);
  });
});
