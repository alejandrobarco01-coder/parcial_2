import { User } from '../../domain/interfaces/user.interface';
import { UsersRepository } from '../ports/users.repository';

/** Caso de uso: listar un número acotado de usuarios. */
export class ListUsersUseCase {
  constructor(private readonly users: UsersRepository) {}

  async execute(limit = 10): Promise<User[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('El límite debe ser un entero entre 1 y 100.');
    }
    return this.users.findAll(limit);
  }
}
