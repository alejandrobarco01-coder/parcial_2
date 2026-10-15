import { CreateUserInput, User, UserEngineering } from '../../domain/interfaces/user.interface';
import { CustomError } from '../../domain/erros/custom.error';
import { UsersRepository } from '../ports/users.repository';

/** Caso de uso: validar y registrar un usuario. */
export class CreateUserUseCase {
  constructor(private readonly users: UsersRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const name = typeof input?.name === 'string' ? input.name.trim() : '';
    const lastName = typeof input?.lastName === 'string' ? input.lastName.trim() : '';
    const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
    const age = input?.age;
    const engineering = input?.engineering;
    const validEngineering = ['Sistemas', 'Electronica', 'Biomedica', 'Industrial', 'Ambiental'];

    if (!name || !lastName || !email || typeof age !== 'number' || !Number.isInteger(age) || age < 18 || age > 100) {
      throw CustomError.badRequest('Nombre, apellido, correo y edad válida (18-100) son obligatorios.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw CustomError.badRequest('El correo electrónico no es válido.');
    }
    if (typeof engineering !== 'string' || !validEngineering.includes(engineering)) {
      throw CustomError.badRequest('La ingeniería seleccionada no es válida.');
    }

    return this.users.create({ name, lastName, email, age, engineering: engineering as UserEngineering });
  }
}
