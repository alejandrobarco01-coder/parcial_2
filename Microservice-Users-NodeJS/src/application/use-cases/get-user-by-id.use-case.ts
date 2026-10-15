import { User } from '../../domain/interfaces/user.interface';
import { UsersRepository } from '../ports/users.repository';
import { CustomError } from '../../domain/erros/custom.error';

/** Caso de uso: consultar un usuario por su identificador. */
export class GetUserByIdUseCase {
  constructor(private readonly users: UsersRepository) {}

  async execute(id: number): Promise<User> {
    if (!Number.isInteger(id) || id < 1) {
      throw CustomError.badRequest('El id debe ser un entero positivo.');
    }
    const user = await this.users.findById(id);
    if (!user) throw CustomError.notFound(`No existe el usuario ${id}.`);
    return user;
  }
}
