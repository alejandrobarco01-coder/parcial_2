import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { CreateUserInput, User, UserEngineering } from '../../domain/user.model';
import { State } from '../../interfaces/state.interface';
import { AlertComponent } from '../../components/alert/alert.component';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { USERS_REPOSITORY } from '../../application/ports/users.repository';
import { HttpUsersRepository } from '../../infrastructure/http-users.repository';

/**
 * Componente contenedor de usuarios.
 *
 * Se utiliza para gestionar y mostrar un listado de usuarios
 * utilizando el componente `TableUsersComponent`.
 *
 * @remarks
 * Este componente invoca los casos de uso de Usuarios y entrega
 * los resultados al componente de tabla. Forma parte de la capa
 * de presentación de la aplicación.
 *
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  imports: [UsersTableComponent, AlertComponent, FormsModule],
  providers: [
    { provide: USERS_REPOSITORY, useClass: HttpUsersRepository },
    ListUsersUseCase,
    GetUserByIdUseCase,
    CreateUserUseCase,
  ],
})
export class UsersPage implements OnInit {
  /**
   * Listado de usuarios obtenidos desde el servicio.
   * @type {User[]}
   */
  users: User[] = [];
  /**
   * Estado actual del componente.
   *
   * @default 'init'
   */
  state: State = 'init';
  selectedUser: User | null = null;
  message = '';
  readonly engineeringOptions: UserEngineering[] = ['Sistemas', 'Electronica', 'Biomedica', 'Industrial', 'Ambiental'];
  userDraft: CreateUserInput = { name: '', lastName: '', age: 18, email: '', engineering: 'Sistemas' };

  /**
   * Casos de uso de la aplicación para la gestión de usuarios.
   * @remarks
   * Se inyecta utilizando la función `inject()` de Angular.
   */
  private readonly listUsers = inject(ListUsersUseCase);
  private readonly getUserById = inject(GetUserByIdUseCase);
  private readonly createUser = inject(CreateUserUseCase);

  /**
   * Inicializa el componente y carga los usuarios mediante el caso de uso de listado.
   */
  ngOnInit(): void {
    void this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.state = 'loading';
    this.message = '';
    try {
      this.users = await this.listUsers.execute(10);
      this.state = 'success';
    } catch (error) {
      this.message = 'No fue posible cargar los usuarios. Verifica que el servicio esté activo.';
      this.state = 'error';
      console.error(error);
    }
  }

  async selectUser(id: number): Promise<void> {
    try {
      this.selectedUser = await this.getUserById.execute(id);
      this.message = '';
    } catch (error) {
      this.message = 'No fue posible consultar el usuario seleccionado.';
      console.error(error);
    }
  }

  async registerUser(): Promise<void> {
    try {
      const created = await this.createUser.execute(this.userDraft);
      this.users = [created, ...this.users];
      this.userDraft = { name: '', lastName: '', age: 18, email: '', engineering: 'Sistemas' };
      this.message = `Usuario ${created.name} creado correctamente.`;
      this.state = 'success';
    } catch (error) {
      this.message = error instanceof RangeError ? error.message : 'No fue posible registrar el usuario.';
      console.error(error);
    }
  }
}
