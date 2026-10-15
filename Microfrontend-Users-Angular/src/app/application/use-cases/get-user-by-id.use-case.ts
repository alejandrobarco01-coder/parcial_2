import { inject, Injectable } from '@angular/core';
import { USERS_REPOSITORY } from '../ports/users.repository';

@Injectable({ providedIn: 'root' })
export class GetUserByIdUseCase {
  private readonly users = inject(USERS_REPOSITORY);

  execute(id: number) {
    if (!Number.isInteger(id) || id < 1) throw new RangeError('El id debe ser un entero positivo.');
    return this.users.findById(id);
  }
}
