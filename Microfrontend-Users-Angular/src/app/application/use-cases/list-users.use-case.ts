import { inject, Injectable } from '@angular/core';
import { USERS_REPOSITORY } from '../ports/users.repository';

@Injectable({ providedIn: 'root' })
export class ListUsersUseCase {
  private readonly users = inject(USERS_REPOSITORY);

  execute(limit = 10) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('El límite debe ser un entero entre 1 y 100.');
    }
    return this.users.findAll(limit);
  }
}
