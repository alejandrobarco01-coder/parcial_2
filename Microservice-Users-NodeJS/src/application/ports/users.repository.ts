import { User, CreateUserInput } from '../../domain/interfaces/user.interface';

/** Puerto que define las operaciones de persistencia de usuarios. */
export interface UsersRepository {
  findAll(limit: number): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
}
