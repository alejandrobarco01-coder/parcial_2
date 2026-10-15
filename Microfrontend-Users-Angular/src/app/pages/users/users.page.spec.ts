import { ComponentFixture, TestBed } from '@angular/core/testing';
import { USERS_REPOSITORY, UsersRepository } from '../../application/ports/users.repository';
import { CreateUserInput, User } from '../../domain/user.model';
import { USERS_MOCK } from '../../mocks/users.mocks';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UsersPage } from './users.page';

describe('UsersPage', () => {
  let fixture: ComponentFixture<UsersPage>;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    repository = {
      findAll: jest.fn().mockResolvedValue(USERS_MOCK),
      findById: jest.fn().mockImplementation(async (id: number) => USERS_MOCK.find((user) => user.id === id)!),
      create: jest.fn().mockImplementation(async (input: CreateUserInput) => ({ id: 3, ...input })),
    };
    TestBed.overrideComponent(UsersPage, {
      set: {
        providers: [
          { provide: USERS_REPOSITORY, useValue: repository },
          ListUsersUseCase,
          GetUserByIdUseCase,
          CreateUserUseCase,
        ],
      },
    });
    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [{ provide: USERS_REPOSITORY, useValue: repository }],
    }).compileComponents();
    fixture = TestBed.createComponent(UsersPage);
  });

  it('carga y renderiza usuarios al iniciar', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(repository.findAll).toHaveBeenCalledWith(10);
    expect(fixture.nativeElement.textContent).toContain('Carlos');
  });

  it('muestra estado de error cuando falla la carga', async () => {
    repository.findAll.mockRejectedValueOnce(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.state).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('Error al cargar los usuarios');
  });

  it('consulta el detalle del usuario seleccionado', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.selectUser(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.selectedUser?.id).toBe(1);
  });

  it('muestra mensaje cuando falla la consulta de detalle', async () => {
    repository.findById.mockRejectedValueOnce(new Error('not found'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.selectUser(500);
    expect(fixture.componentInstance.message).toContain('consultar el usuario');
  });

  it('registra un usuario y limpia el formulario', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const draft = fixture.componentInstance.userDraft;
    Object.assign(draft, { name: ' Luis ', lastName: 'Pérez', age: 25, email: 'luis@example.com' });
    await fixture.componentInstance.registerUser();
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Luis' }));
    expect(fixture.componentInstance.users[0].id).toBe(3);
    expect(fixture.componentInstance.userDraft.name).toBe('');
    expect(fixture.componentInstance.message).toContain('creado correctamente');
  });

  it('muestra validaciones de negocio al registrar', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    Object.assign(fixture.componentInstance.userDraft, {
      name: 'Luis',
      lastName: 'Pérez',
      email: 'no-es-correo',
    });
    await fixture.componentInstance.registerUser();
    expect(repository.create).not.toHaveBeenCalled();
    expect(fixture.componentInstance.message).toContain('correo electrónico');
  });

  it('muestra un mensaje cuando falla el registro en el servidor', async () => {
    repository.create.mockRejectedValueOnce(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    Object.assign(fixture.componentInstance.userDraft, {
      name: 'Luis',
      lastName: 'Pérez',
      email: 'luis@example.com',
    });
    await fixture.componentInstance.registerUser();
    expect(fixture.componentInstance.message).toContain('registrar el usuario');
  });

  it('permite forzar la actualización del listado', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.componentInstance.loadUsers();
    expect(repository.findAll).toHaveBeenCalledTimes(2);
  });
});
