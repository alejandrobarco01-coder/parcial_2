import { inject, Injectable } from '@angular/core';
import { CreateUserInput } from '../../domain/user.model';
import { USERS_REPOSITORY } from '../ports/users.repository';

@Injectable({ providedIn: 'root' })
export class CreateUserUseCase {
  private readonly users = inject(USERS_REPOSITORY);

  execute(input: CreateUserInput) {
    if (!input.name.trim() || !input.lastName.trim()) {
      throw new RangeError('El nombre y el apellido son obligatorios.');
    }
    if (!Number.isInteger(input.age) || input.age < 18 || input.age > 100) {
      throw new RangeError('La edad debe estar entre 18 y 100 años.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
      throw new RangeError('El correo electrónico no es válido.');
    }
    return this.users.create({ ...input, name: input.name.trim(), lastName: input.lastName.trim(), email: input.email.trim().toLowerCase() });
  }
}
