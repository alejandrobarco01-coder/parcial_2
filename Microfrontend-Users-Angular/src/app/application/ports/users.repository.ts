import { InjectionToken } from '@angular/core';
import { CreateUserInput, User } from '../../domain/user.model';

/** Puerto de salida para consultar y registrar usuarios. */
export interface UsersRepository {
  findAll(limit: number): Promise<User[]>;
  findById(id: number): Promise<User>;
  create(input: CreateUserInput): Promise<User>;
}

export const USERS_REPOSITORY = new InjectionToken<UsersRepository>('USERS_REPOSITORY');
